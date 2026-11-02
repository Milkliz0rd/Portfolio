package io.github.milkliz0rd.portfolio.antispam;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import org.junit.jupiter.api.Test;

/** What the chain judges never shows a value in its text: neither a field, nor the token, nor the address key. */
class ContactSubmissionTest {

	@Test
	void itsTextShowsNoValue() {
		ContactSubmission submission = new ContactSubmission(new ContactMessage("MarqueurNom", "MarqueurPrénom",
				"marqueur" + "@" + "exemple.fr", "MarqueurSujet", "MarqueurMessage"), "MarqueurPiege", "MarqueurJeton",
				"203.0.113.10");
		assertThat(submission).hasToString("ContactSubmission[values hidden]");
		assertThat(String.valueOf(submission)).doesNotContainIgnoringCase("marqueur").doesNotContain("203.0.113");
	}

}
