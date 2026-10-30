package io.github.milkliz0rd.portfolio.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.NoOpMessageSender;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;

/** The choice of the message sender from CONTACT_MAIL_SENDER at startup (PB-04, PB-05). */
@ExtendWith(OutputCaptureExtension.class)
class MessageSenderConfigTest {

	private final ApplicationContextRunner runner = new ApplicationContextRunner()
		.withUserConfiguration(MessageSenderConfig.class);

	@Test
	void noneSendsNothingAndIsAnnouncedByAWarning(CapturedOutput output) {
		this.runner.withPropertyValues("contact.mail-sender=none").run((context) -> {
			assertThat(context).getBean(MessageSender.class).isInstanceOf(NoOpMessageSender.class);
			assertThat(output).containsPattern("WARN .* Mail sender: none \\(CONTACT_MAIL_SENDER\\)");
		});
	}

	@Test
	void brevoStopsTheStartupUntilItsAdapterExists() {
		this.runner.withPropertyValues("contact.mail-sender=brevo").run((context) -> {
			assertThat(context).hasFailed();
			assertThat(context.getStartupFailure()).rootCause()
				.hasMessageContaining("CONTACT_MAIL_SENDER is brevo")
				.hasMessageContaining("CONTACT_MAIL_SENDER=none");
		});
	}

	/** The value of application.yaml when the variable is unset; skipped if this shell sets it. */
	@Test
	void anUnsetVariableMeansBrevo() {
		assumeTrue(System.getenv("CONTACT_MAIL_SENDER") == null, "CONTACT_MAIL_SENDER is set in this shell");
		this.runner.withInitializer(new ConfigDataApplicationContextInitializer()).run((context) -> {
			assertThat(context).hasFailed();
			assertThat(context.getStartupFailure()).rootCause().hasMessageContaining("CONTACT_MAIL_SENDER is brevo");
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

}
