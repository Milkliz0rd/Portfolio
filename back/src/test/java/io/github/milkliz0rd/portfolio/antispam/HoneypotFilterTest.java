package io.github.milkliz0rd.portfolio.antispam;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.service.ContactOutcome;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

/** The honeypot (contract, section 3), its edge spaces already removed by the body of E-02. */
class HoneypotFilterTest {

	private final HoneypotFilter filter = new HoneypotFilter();

	@ParameterizedTest
	@NullAndEmptySource
	void anEmptyHoneypotPasses(String website) {
		assertThat(this.filter.check(submission(website))).isEqualTo(FilterVerdict.PASS);
	}

	@ParameterizedTest
	@ValueSource(strings = { "x", "http://robot.example", "0" })
	void anyValueTakesTheMessageSilently(String website) {
		assertThat(this.filter.check(submission(website))).isEqualTo(FilterVerdict.take(ContactOutcome.HONEYPOT));
	}

	static ContactSubmission submission(String website) {
		return new ContactSubmission(new ContactMessage("Nom", "Prénom", "visiteur" + "@" + "exemple.fr", "Sujet",
				"Bonjour"), website, "jeton", "192.0.2.1");
	}

}
