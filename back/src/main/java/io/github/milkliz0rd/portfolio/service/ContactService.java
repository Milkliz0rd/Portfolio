package io.github.milkliz0rd.portfolio.service;

import io.github.milkliz0rd.portfolio.exception.ContactUnavailableException;
import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.SendFailedException;

import org.springframework.stereotype.Service;

/**
 * The contact service: hands a validated message to the message sender, once, and writes the line
 * of its issue (PB-05): sent; or, when the provider did not accept it, a failure, with the code of its
 * answer when it answered, or a timeout, both rendered as the single 503 of E-02; nothing is retried.
 * The filter chain against unwanted messages (TK-22) will run here first; until then, every valid
 * message is handed over, whatever its honeypot and its token.
 */
@Service
public class ContactService {

	private final MessageSender messageSender;

	public ContactService(MessageSender messageSender) {
		this.messageSender = messageSender;
	}

	/** @throws ContactUnavailableException if the provider did not accept the message */
	public void send(ContactMessage message) {
		try {
			this.messageSender.send(message);
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
