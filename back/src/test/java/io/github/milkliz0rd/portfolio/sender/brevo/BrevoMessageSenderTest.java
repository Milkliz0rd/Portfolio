package io.github.milkliz0rd.portfolio.sender.brevo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.assertj.core.api.Assertions.assertThatIllegalStateException;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withException;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

import java.io.IOException;
import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.net.URI;
import java.net.UnknownHostException;
import java.net.http.HttpConnectTimeoutException;
import java.net.http.HttpTimeoutException;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;

import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.sender.SendFailedException;
import io.github.milkliz0rd.portfolio.sender.SendFailedException.Kind;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import org.springframework.boot.logging.LogLevel;
import org.springframework.boot.logging.LoggingSystem;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.http.client.MockClientHttpRequest;
import org.springframework.test.json.JsonCompareMode;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

/**
 * The Brevo adapter against the simulated server of Spring's test tools, bound to the client builder
 * of BrevoRestClientFactory (PB-07): the exact call, any 2xx a success, any other answer and a network
 * error a failure, an expired time limit a timeout; never a value in a text or in a log.
 */
@ExtendWith(OutputCaptureExtension.class)
class BrevoMessageSenderTest {

	/** Visibly fake, drawn at each run. */
	private static final String KEY = "cle-factice-" + UUID.randomUUID();

	private static final String FROM = "marqueur.expedition" + "@" + "exemple.fr";

	private static final String TO = "marqueur.destination" + "@" + "exemple.fr";

	private static final String VISITOR = "marqueur.visiteur" + "@" + "exemple.fr";

	private static final ContactMessage MESSAGE = new ContactMessage("MarqueurNom", "MarqueurPrénom", VISITOR,
			"MarqueurSujet", "MarqueurMessage,\nsur deux lignes.");

	private static final JsonMapper JSON = JsonMapper.builder().build();

	private final RestClient.Builder builder = BrevoRestClientFactory.builder(URI.create("https://api.brevo.com/v3"),
			Duration.ofSeconds(10));

	private final MockRestServiceServer server = MockRestServiceServer.bindTo(this.builder).build();

	private final BrevoMessageSender sender = new BrevoMessageSender(this.builder, KEY, FROM, TO);

	@Test
	void theCallIsAPostOfTheExactEmail() {
		String expected = JSON.writeValueAsString(Map.of("sender", Map.of("email", FROM, "name", "Formulaire du portfolio"),
				"to", List.of(Map.of("email", TO)), "replyTo",
				Map.of("email", VISITOR, "name", "MarqueurPrénom MarqueurNom"), "subject", "[Portfolio] MarqueurSujet",
				"textContent", "Nom : MarqueurNom\nPrénom : MarqueurPrénom\nAdresse e-mail : " + VISITOR
						+ "\nSujet : MarqueurSujet\n\nMessage :\nMarqueurMessage,\nsur deux lignes."));
		this.server.expect(once(), requestTo("https://api.brevo.com/v3/smtp/email"))
			.andExpect(method(HttpMethod.POST))
			.andExpect(header("api-key", KEY))
			.andExpect(content().contentType(MediaType.APPLICATION_JSON))
			// Strict: no other property, so neither htmlContent nor a copy, and exactly one recipient.
			.andExpect(content().json(expected, JsonCompareMode.STRICT))
			.andRespond(withStatus(HttpStatus.CREATED).contentType(MediaType.APPLICATION_JSON)
				.body("{\"messageId\":\"<marqueur>\"}"));
		this.sender.send(MESSAGE);
		this.server.verify();
	}

	/** The back never writes to the visitor's address: only CONTACT_MAIL_TO receives the e-mail (CT-07). */
	@Test
	void theVisitorIsOnlyTheReplyToAddress() {
		this.server.expect(once(), requestTo("https://api.brevo.com/v3/smtp/email")).andExpect((request) -> {
			Map<String, Object> body = JSON.readValue(((MockClientHttpRequest) request).getBodyAsString(),
					new TypeReference<>() {
					});
			assertThat(body).containsOnlyKeys("sender", "to", "replyTo", "subject", "textContent");
			assertThat(body.get("to")).isEqualTo(List.of(Map.of("email", TO)));
			assertThat(((Map<?, ?>) body.get("replyTo")).get("email")).isEqualTo(VISITOR);
		}).andRespond(withStatus(HttpStatus.CREATED));
		this.sender.send(MESSAGE);
		this.server.verify();
	}

	@ParameterizedTest
	@ValueSource(ints = { 200, 201, 202, 204 })
	void anyTwoHundredIsASuccess(int status) {
		this.server.expect(once(), requestTo("https://api.brevo.com/v3/smtp/email"))
			.andRespond(withStatus(HttpStatus.valueOf(status)));
		this.sender.send(MESSAGE);
		this.server.verify();
	}

	/** A refused call, a refused key, a provider error, a redirection: a failure with the code, the body unread. */
	@ParameterizedTest
	@ValueSource(ints = { 400, 401, 403, 429, 500, 502, 503, 302 })
	void anyOtherAnswerIsAFailureWithItsCode(int status) {
		this.server.expect(once(), requestTo("https://api.brevo.com/v3/smtp/email"))
			.andRespond(withStatus(HttpStatus.valueOf(status)).contentType(MediaType.APPLICATION_JSON)
				.body("{\"code\":\"marqueur\",\"message\":\"" + VISITOR + "\"}"));
		assertThatExceptionOfType(SendFailedException.class).isThrownBy(() -> this.sender.send(MESSAGE))
			.satisfies((failure) -> {
				assertThat(failure.kind()).isEqualTo(Kind.FAILURE);
				assertThat(failure.providerStatus()).isEqualTo(status);
				assertThat(failure).hasNoCause().hasMessageNotContainingAny("marqueur", KEY);
			});
	}

	/** No connection, an unknown host, a reset: a failure; the time limit of the answer or of the connection: a timeout. */
	static Stream<Arguments> inputOutputErrors() {
		return Stream.of(arguments(new ConnectException("Connection refused"), Kind.FAILURE),
				arguments(new UnknownHostException("marqueur"), Kind.FAILURE),
				arguments(new IOException("Connection reset"), Kind.FAILURE),
				arguments(new HttpTimeoutException("request timed out"), Kind.TIMEOUT),
				arguments(new HttpConnectTimeoutException("HTTP connect timed out"), Kind.TIMEOUT),
				arguments(new SocketTimeoutException("Read timed out"), Kind.TIMEOUT));
	}

	@ParameterizedTest
	@MethodSource("inputOutputErrors")
	void anInputOutputErrorIsAFailureOrATimeoutWithoutCode(IOException error, Kind kind) {
		this.server.expect(once(), requestTo("https://api.brevo.com/v3/smtp/email")).andRespond(withException(error));
		assertThatExceptionOfType(SendFailedException.class).isThrownBy(() -> this.sender.send(MESSAGE))
			.satisfies((failure) -> {
				assertThat(failure.kind()).isEqualTo(kind);
				assertThat(failure.providerStatus()).isNull();
				assertThat(failure).hasNoCause().hasMessageNotContaining("marqueur");
			});
	}

	/** A key or an address made of spaces is missing; the other wrong settings: MessageSenderConfigTest. */
	@Test
	void aBlankKeyOrAddressIsMissing() {
		assertThatIllegalStateException().isThrownBy(() -> new BrevoMessageSender(this.builder, " \t", FROM, TO))
			.withMessageStartingWith("CONTACT_BREVO_API_KEY is missing");
		assertThatIllegalStateException().isThrownBy(() -> new BrevoMessageSender(this.builder, KEY, "\u3000", TO))
			.withMessageStartingWith("CONTACT_MAIL_FROM is missing");
		assertThatIllegalStateException().isThrownBy(() -> new BrevoMessageSender(this.builder, KEY, FROM, null))
			.withMessageStartingWith("CONTACT_MAIL_TO is missing");
	}

	@Test
	void noTextShowsAValue() {
		BrevoEmailRequest request = BrevoEmailRequest.of(MESSAGE, FROM, TO);
		assertThat(List.of(this.sender, request, request.sender(), request.to().getFirst(), request.replyTo()))
			.allSatisfy((part) -> assertThat(part.toString()).doesNotContain(KEY).doesNotContainIgnoringCase("marqueur"));
	}

	/** Spring's client writes the body it sends at DEBUG: its text, and nothing else, hides every value. */
	@Test
	void atDebugLevelNothingIsShownEither(CapturedOutput output) {
		LoggingSystem logging = LoggingSystem.get(getClass().getClassLoader());
		logging.setLogLevel("org.springframework.web", LogLevel.DEBUG);
		try {
			this.server.expect(once(), requestTo("https://api.brevo.com/v3/smtp/email"))
				.andRespond(withStatus(HttpStatus.CREATED).body("{\"messageId\":\"<marqueur>\"}"));
			this.server.expect(once(), requestTo("https://api.brevo.com/v3/smtp/email"))
				.andRespond(withStatus(HttpStatus.BAD_REQUEST).body("{\"message\":\"marqueur\"}"));
			this.sender.send(MESSAGE);
			assertThatExceptionOfType(SendFailedException.class).isThrownBy(() -> this.sender.send(MESSAGE));
		}
		finally {
			logging.setLogLevel("org.springframework.web", null);
		}
		assertThat(output).contains("Writing [BrevoEmailRequest[values hidden]]")
			.doesNotContain(KEY)
			.doesNotContainIgnoringCase("marqueur");
	}

}
