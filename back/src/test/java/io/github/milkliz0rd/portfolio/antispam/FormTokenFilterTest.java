package io.github.milkliz0rd.portfolio.antispam;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import io.github.milkliz0rd.portfolio.MutableClock;
import io.github.milkliz0rd.portfolio.TestSecrets;
import io.github.milkliz0rd.portfolio.config.ContactProperties;
import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.service.ContactOutcome;
import io.github.milkliz0rd.portfolio.service.FormTokenService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

/** The token filter on the real FormTokenService, its clock moved, never awaited (PB-02, PB-07). */
class FormTokenFilterTest {

	private final MutableClock clock = new MutableClock(Instant.parse("2026-11-02T10:00:00Z"));

	private final FormTokenService service = new FormTokenService(TestSecrets.draw(32),
			new ContactProperties(List.of(), Duration.ofSeconds(3), Duration.ofHours(2), Duration.ofSeconds(10),
					"https://api.brevo.com/v3", "", 1),
			this.clock);

	private final FormTokenFilter filter = new FormTokenFilter(this.service);

	@Test
	void aValidTokenPassesFromTheMinimalDelayToTheMaximalAge() {
		String token = this.service.issue();
		this.clock.advance(Duration.ofSeconds(3));
		assertThat(this.filter.check(submission(token))).isEqualTo(FilterVerdict.PASS);
		this.clock.advance(Duration.ofHours(2).minusSeconds(3));
		assertThat(this.filter.check(submission(token))).isEqualTo(FilterVerdict.PASS);
	}

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = " \t")
	void aMissingTokenIsRefused(String token) {
		assertThat(this.filter.check(submission(token))).isEqualTo(FilterVerdict.refuse(ContactOutcome.TOKEN_MISSING));
	}

	@Test
	void aForgedTokenIsRefused() {
		String token = this.service.issue();
		this.clock.advance(Duration.ofSeconds(3));
		String forged = token.substring(0, 36) + ((token.charAt(36) == 'A') ? 'B' : 'A') + token.substring(37);
		assertThat(this.filter.check(submission(forged))).isEqualTo(FilterVerdict.refuse(ContactOutcome.TOKEN_FORGED));
		assertThat(this.filter.check(submission("jeton-opaque")))
			.isEqualTo(FilterVerdict.refuse(ContactOutcome.TOKEN_FORGED));
	}

	@Test
	void aTokenTooRecentOrExpiredIsRefused() {
		String token = this.service.issue();
		this.clock.advance(Duration.ofMillis(2999));
		assertThat(this.filter.check(submission(token)))
			.isEqualTo(FilterVerdict.refuse(ContactOutcome.TOKEN_TOO_RECENT));
		this.clock.advance(Duration.ofHours(2).minusMillis(2999).plusMillis(1));
		assertThat(this.filter.check(submission(token))).isEqualTo(FilterVerdict.refuse(ContactOutcome.TOKEN_EXPIRED));
	}

	private static ContactSubmission submission(String token) {
		return new ContactSubmission(new ContactMessage("Nom", "Prénom", "visiteur" + "@" + "exemple.fr", "Sujet",
				"Bonjour"), "", token, "192.0.2.1");
	}

}
