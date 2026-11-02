package io.github.milkliz0rd.portfolio.service;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

import java.util.List;

import io.github.milkliz0rd.portfolio.antispam.ContactFilter;
import io.github.milkliz0rd.portfolio.antispam.ContactSubmission;
import io.github.milkliz0rd.portfolio.antispam.FilterVerdict;
import io.github.milkliz0rd.portfolio.exception.ContactUnavailableException;
import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.SendFailedException;
import io.github.milkliz0rd.portfolio.sender.SendFailedException.Kind;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.InOrder;

/**
 * The contact service without Spring (PB-03, PB-06, PB-07): the chain runs in its order and the first
 * filter that stops the message ends it; a message stopped is never sent, and the places the filters
 * before reserved are given back, in the reverse order; a message handed over keeps its places, even
 * when the provider fails.
 */
class ContactServiceTest {

	private final ContactFilter first = mock(ContactFilter.class, "first");

	private final ContactFilter second = mock(ContactFilter.class, "second");

	private final ContactFilter third = mock(ContactFilter.class, "third");

	private final MessageSender sender = mock(MessageSender.class);

	private final ContactService service = new ContactService(List.of(this.first, this.second, this.third), this.sender);

	private final ContactSubmission submission = new ContactSubmission(
			new ContactMessage("Nom", "Prénom", "visiteur" + "@" + "exemple.fr", "Sujet", "Bonjour"), "", "jeton",
			"192.0.2.1");

	@BeforeEach
	void everyFilterPasses() {
		for (ContactFilter filter : List.of(this.first, this.second, this.third)) {
			given(filter.check(this.submission)).willReturn(FilterVerdict.PASS);
		}
	}

	@Test
	void aMessageThatPassesEveryFilterIsSentOnceAndKeepsItsPlaces() {
		this.service.send(this.submission);
		InOrder order = inOrder(this.first, this.second, this.third, this.sender);
		order.verify(this.first).check(this.submission);
		order.verify(this.second).check(this.submission);
		order.verify(this.third).check(this.submission);
		order.verify(this.sender).send(this.submission.message());
		verifyNoMoreInteractions(this.first, this.second, this.third, this.sender);
	}

	/** The honeypot: no exception, so the 202 of a sending; the rest of the chain is not run. */
	@Test
	void aMessageTakenSilentlyIsNotSentAndGivesBackThePlacesBefore() {
		given(this.second.check(this.submission)).willReturn(FilterVerdict.take(ContactOutcome.HONEYPOT));
		this.service.send(this.submission);
		InOrder order = inOrder(this.first, this.second);
		order.verify(this.first).check(this.submission);
		order.verify(this.second).check(this.submission);
		order.verify(this.first).release(this.submission);
		verifyNoMoreInteractions(this.first, this.second);
		verifyNoInteractions(this.third, this.sender);
	}

	@ParameterizedTest
	@EnumSource(names = { "TOKEN_MISSING", "TOKEN_FORGED", "TOKEN_TOO_RECENT", "TOKEN_EXPIRED", "IP_LIMIT" })
	void aRefusedMessageIsNotSentAndGivesBackThePlacesInTheReverseOrder(ContactOutcome outcome) {
		given(this.third.check(this.submission)).willReturn(FilterVerdict.refuse(outcome));
		assertThatExceptionOfType(ContactUnavailableException.class).isThrownBy(() -> this.service.send(this.submission));
		InOrder order = inOrder(this.first, this.second, this.third);
		order.verify(this.first).check(this.submission);
		order.verify(this.second).check(this.submission);
		order.verify(this.third).check(this.submission);
		order.verify(this.second).release(this.submission);
		order.verify(this.first).release(this.submission);
		verifyNoMoreInteractions(this.first, this.second, this.third);
		verifyNoInteractions(this.sender);
	}

	@Test
	void theFirstFilterThatRefusesEndsTheChainWithNothingToGiveBack() {
		given(this.first.check(this.submission)).willReturn(FilterVerdict.refuse(ContactOutcome.TOKEN_MISSING));
		assertThatExceptionOfType(ContactUnavailableException.class).isThrownBy(() -> this.service.send(this.submission));
		verify(this.first, never()).release(any());
		verifyNoInteractions(this.second, this.third, this.sender);
	}

	/** The message was handed over: whatever the provider answered, it counts. */
	@ParameterizedTest
	@EnumSource(Kind.class)
	void aFailureOfTheProviderKeepsThePlaces(Kind kind) {
		willThrow(new SendFailedException(kind, null)).given(this.sender).send(any());
		assertThatExceptionOfType(ContactUnavailableException.class).isThrownBy(() -> this.service.send(this.submission));
		verify(this.sender).send(this.submission.message());
		for (ContactFilter filter : List.of(this.first, this.second, this.third)) {
			verify(filter, never()).release(any());
		}
	}

}
