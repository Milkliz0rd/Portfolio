package io.github.milkliz0rd.portfolio.sender.brevo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

import io.github.milkliz0rd.portfolio.controller.ContactMessageController;
import io.github.milkliz0rd.portfolio.exception.ContactUnavailableException;
import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.service.ContactOutcomeLog;
import io.github.milkliz0rd.portfolio.service.ContactService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * The time limit as the real client applies it (PB-07): the JDK's HTTP server answers after 2
 * seconds, the client is set on 1 second; the contact service gives up in less than 2 seconds, with
 * the single line provider-timeout, and its refusal becomes the 503 of E-02.
 */
@ExtendWith(OutputCaptureExtension.class)
class ProviderTimeLimitTest {

	private static final ContactMessage MESSAGE = new ContactMessage("MarqueurNom", "MarqueurPrénom",
			"marqueur.visiteur" + "@" + "exemple.fr", "MarqueurSujet", "MarqueurMessage");

	@AfterEach
	void forgetTheRequest() {
		RequestContextHolder.resetRequestAttributes();
	}

	@Test
	void aSilentProviderIsATimeoutWithinTheTimeLimit(CapturedOutput output) throws IOException {
		MockHttpServletRequest request = new MockHttpServletRequest("POST", ContactMessageController.ROUTE);
		ContactOutcomeLog.markArrival(request);
		RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
		try (LocalHttpServer server = new LocalHttpServer(201, Duration.ofSeconds(2))) {
			ContactService service = new ContactService(new BrevoMessageSender(
					BrevoRestClientFactory.builder(server.baseUrl(), Duration.ofSeconds(1)),
					"cle-factice-" + UUID.randomUUID(), "marqueur.expedition" + "@" + "exemple.fr",
					"marqueur.destination" + "@" + "exemple.fr"));
			long start = System.nanoTime();
			assertThatExceptionOfType(ContactUnavailableException.class).isThrownBy(() -> service.send(MESSAGE));
			assertThat(Duration.ofNanos(System.nanoTime() - start)).isBetween(Duration.ofMillis(900),
					Duration.ofMillis(1999));
			assertThat(server.paths()).containsExactly("/v3/smtp/email");
		}
		assertThat(output.getAll().lines().filter((line) -> line.contains("contact-message"))).singleElement()
			.asString()
			.matches(".* WARN .* contact-message outcome=provider-timeout durationMs=\\d+");
		assertThat(output.getAll()).doesNotContainIgnoringCase("marqueur").doesNotContain("cle-factice");
	}

}
