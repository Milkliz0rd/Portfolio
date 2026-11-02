package io.github.milkliz0rd.portfolio.service;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;
import java.util.Objects;

import io.github.milkliz0rd.portfolio.antispam.ContactFilter;
import io.github.milkliz0rd.portfolio.antispam.ContactSubmission;
import io.github.milkliz0rd.portfolio.antispam.FilterVerdict;
import io.github.milkliz0rd.portfolio.exception.ContactUnavailableException;
import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.SendFailedException;

import org.springframework.stereotype.Service;

/**
 * The contact service: runs the filter chain on a validated message, in the order of its components
 * (PB-06), then hands the message to the message sender, once, and writes the line of its issue
 * (PB-05). The first filter that stops the message ends the chain: taken silently, the message gets
 * the 202 of a sending; refused, the single 503 of E-02. Either way, nothing is sent, and the places
 * that the filters before it reserved are given back, in the reverse order: a refused message counts
 * for nothing (PB-03). A message handed over keeps its places, even when the provider does not accept
 * it, a failure with the code of its answer when it answered, or a timeout, both rendered as the 503;
 * nothing is retried.
 */
@Service
public class ContactService {

	private final List<ContactFilter> filters;

	private final MessageSender messageSender;

	public ContactService(List<ContactFilter> filters, MessageSender messageSender) {
		this.filters = List.copyOf(filters);
		this.messageSender = messageSender;
	}

	/** @throws ContactUnavailableException if a filter refuses the message or the provider did not accept it */
	public void send(ContactSubmission submission) {
		Deque<ContactFilter> passed = new ArrayDeque<>();
		for (ContactFilter filter : this.filters) {
			FilterVerdict verdict = filter.check(submission);
			if (verdict.decision() != FilterVerdict.Decision.PASS) {
				// The last one passed first.
				passed.forEach((reserving) -> reserving.release(submission));
				ContactOutcomeLog.write(Objects.requireNonNull(verdict.outcome()));
				if (verdict.decision() == FilterVerdict.Decision.REFUSE) {
					throw new ContactUnavailableException();
				}
				return;
			}
			passed.push(filter);
		}
		try {
			this.messageSender.send(submission.message());
		}
		catch (SendFailedException ex) {
			if (ex.kind() == SendFailedException.Kind.TIMEOUT) {
				ContactOutcomeLog.write(ContactOutcome.PROVIDER_TIMEOUT);
			}
			else {
				ContactOutcomeLog.writeProviderFailure(ex.providerStatus());
			}
			throw new ContactUnavailableException();
		}
		ContactOutcomeLog.write(ContactOutcome.SENT);
	}

}
