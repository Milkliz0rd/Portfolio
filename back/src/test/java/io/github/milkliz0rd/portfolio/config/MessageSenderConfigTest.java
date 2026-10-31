package io.github.milkliz0rd.portfolio.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.util.UUID;

import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.NoOpMessageSender;
import io.github.milkliz0rd.portfolio.sender.brevo.BrevoMessageSender;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.context.assertj.AssertableApplicationContext;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;

/**
 * The choice of the message sender from CONTACT_MAIL_SENDER at startup, and the settings of Brevo it
 * checks (PB-04, PB-05): a refusal names the variable, and no output shows the key or an address.
 */
@ExtendWith(OutputCaptureExtension.class)
class MessageSenderConfigTest {

	/** Visibly fake, drawn at each run. */
	private static final String KEY = "cle-factice-" + UUID.randomUUID();

	private static final String FROM = "marqueur.expedition" + "@" + "exemple.fr";

	private static final String TO = "marqueur.destination" + "@" + "exemple.fr";

	private final ApplicationContextRunner runner = new ApplicationContextRunner()
		.withUserConfiguration(MessageSenderConfig.class, PropertiesConfiguration.class)
		.withPropertyValues("contact.token-min-age=3s", "contact.token-max-age=2h", "contact.provider-timeout=10s",
				"contact.brevo-base-url=https://api.brevo.com/v3");

	/** Brevo with all its settings, the listed ones replaced. */
	private ApplicationContextRunner brevo(String... replacements) {
		return this.runner
			.withPropertyValues("contact.mail-sender=brevo", "contact.brevo-api-key=" + KEY, "contact.mail-from=" + FROM,
					"contact.mail-to=" + TO)
			.withPropertyValues(replacements);
	}

	@Test
	void brevoIsBuiltFromItsSettingsAndAnnounced(CapturedOutput output) {
		brevo().run((context) -> {
			assertThat(context).getBean(MessageSender.class)
				.isInstanceOf(BrevoMessageSender.class)
				.hasToString("BrevoMessageSender[key and addresses hidden]");
			assertThat(output).containsPattern("INFO .* Mail sender: brevo \\(CONTACT_MAIL_SENDER\\)");
		});
		assertThat(output).doesNotContain(KEY).doesNotContainIgnoringCase("marqueur");
	}

	@Test
	void noneSendsNothingAndIsAnnouncedByAWarning(CapturedOutput output) {
		this.runner.withPropertyValues("contact.mail-sender=none").run((context) -> {
			assertThat(context).getBean(MessageSender.class).isInstanceOf(NoOpMessageSender.class);
			assertThat(output).containsPattern("WARN .* Mail sender: none \\(CONTACT_MAIL_SENDER\\)");
		});
	}

	/** A missing or unfit key; a missing or invalid address, one without dot after the at sign included. */
	@ParameterizedTest
	@CsvSource(delimiter = '|', value = { "contact.brevo-api-key= | CONTACT_BREVO_API_KEY is missing",
			"contact.brevo-api-key=marqueur cle | CONTACT_BREVO_API_KEY must be made of visible ASCII",
			"contact.brevo-api-key=marqueur-clé | CONTACT_BREVO_API_KEY must be made of visible ASCII",
			"contact.mail-from= | CONTACT_MAIL_FROM is missing",
			"contact.mail-from=marqueur-sans-arobase | CONTACT_MAIL_FROM is not a valid e-mail address",
			"contact.mail-to= | CONTACT_MAIL_TO is missing",
			"contact.mail-to=pas-une-adresse-marqueur | CONTACT_MAIL_TO is not a valid e-mail address",
			"contact.mail-to=marqueur" + "@" + "exemple | CONTACT_MAIL_TO is not a valid e-mail address" })
	void brevoWithAWrongSettingStopsTheStartupWithoutShowingAnyValue(String setting, String message,
			CapturedOutput output) {
		brevo(setting).run((context) -> {
			assertThat(context).hasFailed();
			assertThat(context.getStartupFailure()).rootCause().hasMessageStartingWith(message);
			assertThat(messages(context)).doesNotContain(KEY).doesNotContainIgnoringCase("marqueur");
		});
		assertThat(output).doesNotContain(KEY).doesNotContainIgnoringCase("marqueur");
	}

	/** The value of application.yaml when the variables are unset; skipped if this shell sets them. */
	@Test
	void anUnsetVariableMeansBrevoWhichRequiresItsKey() {
		assumeTrue(System.getenv("CONTACT_MAIL_SENDER") == null && System.getenv("CONTACT_BREVO_API_KEY") == null,
				"CONTACT_MAIL_SENDER or CONTACT_BREVO_API_KEY is set in this shell");
		this.runner.withInitializer(new ConfigDataApplicationContextInitializer()).run((context) -> {
			assertThat(context).hasFailed();
			assertThat(context.getStartupFailure()).rootCause()
				.hasMessageStartingWith("CONTACT_BREVO_API_KEY is missing")
				.hasMessageContaining("CONTACT_MAIL_SENDER=none");
		});
	}

	@ParameterizedTest
	@ValueSource(strings = { "", "None", "NONE", "n-o-n-e", "brevo,none", "valeur-inconnue" })
	void anyOtherValueStopsTheStartupWithoutBeingShown(String value) {
		this.runner.withPropertyValues("contact.mail-sender=" + value).run((context) -> {
			assertThat(context).hasFailed();
			assertThat(context.getStartupFailure()).rootCause()
				.hasMessage("CONTACT_MAIL_SENDER must be brevo or none");
		});
	}

	/** Every message of the startup failure and of its causes. */
	private static String messages(AssertableApplicationContext context) {
		StringBuilder messages = new StringBuilder();
		for (Throwable failure = context.getStartupFailure(); failure != null; failure = failure.getCause()) {
			messages.append(failure).append('\n');
		}
		return messages.toString();
	}

	@EnableConfigurationProperties(ContactProperties.class)
	static class PropertiesConfiguration {

	}

}
