package io.github.milkliz0rd.portfolio.web;

import static io.github.milkliz0rd.portfolio.controller.ContactMessageController.ROUTE;
import static io.github.milkliz0rd.portfolio.web.ContractResults.SECURITY_HEADERS;
import static io.github.milkliz0rd.portfolio.web.ContractResults.errorBody;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_MAX_AGE;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD;
import static org.springframework.http.HttpHeaders.ALLOW;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.HttpHeaders.ORIGIN;
import static org.springframework.http.HttpHeaders.VARY;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.TEXT_HTML;
import static org.springframework.http.MediaType.TEXT_PLAIN;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import io.github.milkliz0rd.portfolio.MutableClock;
import io.github.milkliz0rd.portfolio.TestSecrets;
import io.github.milkliz0rd.portfolio.exception.ContactUnavailableException;
import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.SendFailedException;
import io.github.milkliz0rd.portfolio.sender.SendFailedException.Kind;
import io.github.milkliz0rd.portfolio.service.FormTokenService;
import jakarta.servlet.RequestDispatcher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

/**
 * E-02 through the HTTP foundation, in a web slice: the real controller, filters, validation, error
 * handler, contact service, filter chain and FormTokenService, whose tokens are issued under a clock
 * the tests move; only the message sender is simulated (PB-07).
 */
@WebMvcTest(properties = { "contact.allowed-origins=https://www.site.example",
		"contact.client-ip-header=X-Forwarded-For" })
@Import(ContactChainConfiguration.class)
class ContactMessageEndpointTest {

	static final String ALLOWED = "https://www.site.example";

	static final String ADDRESS = "visiteur" + "@" + "exemple.fr";

	/** Removes a property from the body. */
	static final Object ABSENT = new Object();

	private static final JsonMapper JSON = JsonMapper.builder().build();

	private static final String SECRET = TestSecrets.draw(32);

	/** The token of the current test, issued by the back, of the minimal age: valid; {@link #body} sends it. */
	private static String token = "";

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private MessageSender messageSender;

	@Autowired
	private FormTokenService formTokenService;

	@Autowired
	private MutableClock clock;

	@DynamicPropertySource
	static void tokenSecret(DynamicPropertyRegistry registry) {
		registry.add("contact.token-secret", () -> SECRET);
	}

	/** A new day, so that the counters of the slice are back at zero, and a token. */
	@BeforeEach
	void issueAValidToken() {
		this.clock.advance(Duration.ofDays(1));
		newToken();
	}

	void newToken() {
		token = this.formTokenService.issue();
		this.clock.advance(Duration.ofSeconds(3));
	}

	@Test
	void aValidMessageGets202AndIsHandedOnceToTheSenderWithoutItsEdgeSpaces() throws Exception {
		send(body("lastName", "\u3000 Nom ", "subject", "\tSujet\u205F", "email", " " + ADDRESS + "\n"))
			.andExpect(status().isAccepted())
			.andExpect(content().string(""))
			.andExpect(header().doesNotExist(CONTENT_TYPE))
			.andExpect(SECURITY_HEADERS)
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED))
			.andExpect(header().stringValues(VARY, "Origin"));
		verify(this.messageSender).send(new ContactMessage("Nom", "Prénom", ADDRESS, "Sujet", "Bonjour,\nmerci."));
		verifyNoMoreInteractions(this.messageSender);
	}

	/** Null, absent, or made of edge spaces: an empty honeypot. */
	@ParameterizedTest
	@MethodSource("emptyHoneypots")
	void aMessageWithAnEmptyHoneypotIsSent(Object website) throws Exception {
		send(body("website", website)).andExpect(status().isAccepted());
		verify(this.messageSender).send(any());
	}

	static Stream<Object> emptyHoneypots() {
		return Stream.of(ABSENT, null, "", " \u3000\t");
	}

	/** The 202 of a sending, the same headers, and nothing leaves (CT-08); the token is not even looked at. */
	@ParameterizedTest
	@ValueSource(strings = { "http://robot.example", " x " })
	void aFilledHoneypotGetsThe202OfASendingAndNothingIsHandedOver(String website) throws Exception {
		MockHttpServletResponse sent = send(body()).andReturn().getResponse();
		send(body("website", website, "formToken", ABSENT)).andExpect(status().isAccepted())
			.andExpect(content().string(""))
			.andExpect(header().doesNotExist(CONTENT_TYPE))
			.andExpect((result) -> assertThat(headers(result.getResponse())).isEqualTo(headers(sent)));
		verify(this.messageSender, times(1)).send(any());
	}

	/** Missing, forged, too recent or expired: the single 503, identical whatever the cause, and nothing leaves. */
	@Test
	void aRefusedTokenGetsTheSingle503AndNothingIsHandedOver() throws Exception {
		List<String> bodies = new ArrayList<>();
		String forged = token.substring(0, 36) + ((token.charAt(36) == 'A') ? 'B' : 'A') + token.substring(37);
		for (Object refused : new Object[] { ABSENT, null, "", " \t", "jeton-opaque", forged,
				this.formTokenService.issue() }) {
			bodies.add(unavailable(send(body("formToken", refused))));
		}
		this.clock.advance(Duration.ofHours(2).minusSeconds(3).plusMillis(1));
		bodies.add(unavailable(send(body())));
		assertThat(bodies).hasSize(8).containsOnly(bodies.getFirst());
		verify(this.messageSender, never()).send(any());
	}

	/** The sixth message of the hour of an address, whatever is forged on the left, gets the 503; not another's. */
	@Test
	void theSixthMessageOfTheHourFromOneAddressGetsTheSingle503() throws Exception {
		for (int i = 0; i < 5; i++) {
			send(body(), "198.51.100.9" + i + ", 203.0.113.10").andExpect(status().isAccepted());
		}
		unavailable(send(body(), "198.51.100.99, 203.0.113.10"));
		send(body(), "203.0.113.11").andExpect(status().isAccepted());
		verify(this.messageSender, times(6)).send(any());
	}

	/** Refused by the validation, the honeypot or the token: a message counts for nothing (PB-03). */
	@Test
	void aMessageRefusedBeforeTheLimitDoesNotCount() throws Exception {
		for (int i = 0; i < 5; i++) {
			send(body("subject", ""), "203.0.113.10").andExpect(status().isBadRequest());
			send(body("website", "x"), "203.0.113.10").andExpect(status().isAccepted());
			unavailable(send(body("formToken", ABSENT), "203.0.113.10"));
		}
		for (int i = 0; i < 5; i++) {
			send(body(), "203.0.113.10").andExpect(status().isAccepted());
		}
		unavailable(send(body(), "203.0.113.10"));
		verify(this.messageSender, times(5)).send(any());
	}

	/** Fifty messages, from ten addresses, reach the cap: the next one gets the 503, from any address. */
	@Test
	void theMessageAfterTheCapGetsTheSingle503() throws Exception {
		fillTheCap();
		unavailable(send(body(), "203.0.113.200"));
		verify(this.messageSender, times(50)).send(any());
	}

	/** Refused by the cap, a message gives back the place it took in the limit per address (PB-03). */
	@Test
	void aMessageRefusedByTheCapGivesBackItsPlaceInTheLimit() throws Exception {
		fillTheCap();
		this.clock.advance(Duration.ofHours(23).plusMinutes(30));
		newToken();
		for (int i = 0; i < 5; i++) {
			unavailable(send(body(), "203.0.113.200"));
		}
		// The cap opens a new window; the address has had no message counted.
		this.clock.advance(Duration.ofMinutes(30));
		send(body(), "203.0.113.200").andExpect(status().isAccepted());
	}

	/** The seven 503 of PB-07, and the provider's timeout: the same body, but for its timestamp (PB-06). */
	@Test
	void everyRefusalAndFailureGetsTheSameBody() throws Exception {
		List<String> bodies = new ArrayList<>();
		willThrow(new SendFailedException(Kind.FAILURE, 500)).willThrow(new SendFailedException(Kind.TIMEOUT, null))
			.willDoNothing()
			.given(this.messageSender)
			.send(any());
		bodies.add(unavailable(send(body())));
		bodies.add(unavailable(send(body())));
		bodies.add(unavailable(send(body("formToken", ABSENT))));
		bodies.add(unavailable(send(body("formToken", "jeton-opaque"))));
		bodies.add(unavailable(send(body("formToken", this.formTokenService.issue()))));
		this.clock.advance(Duration.ofDays(1));
		newToken();
		fillTheCap();
		// The limit per address comes before the cap.
		bodies.add(unavailable(send(body(), "198.51.100.1")));
		bodies.add(unavailable(send(body(), "203.0.113.200")));
		this.clock.advance(Duration.ofHours(2).minusSeconds(3).plusMillis(1));
		bodies.add(unavailable(send(body())));
		assertThat(bodies).hasSize(8).containsOnly(bodies.getFirst());
	}

	/** Handler, filter, validation or fallback: each error is stamped by the back's clock, to the second (PB-06). */
	@Test
	void theErrorsAreStampedByTheInjectedClock() throws Exception {
		this.clock.advance(Duration.ofMillis(500));
		String now = this.clock.instant().truncatedTo(ChronoUnit.SECONDS).toString();
		for (ResultActions error : List.of(send(body("formToken", ABSENT)), send(body("subject", "")),
				this.mockMvc.perform(post(ROUTE).header(ORIGIN, "https://autre.example")),
				this.mockMvc.perform(post(ROUTE + "/inconnue")),
				this.mockMvc.perform(get("/error").requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 500)))) {
			Map<String, Object> body = JSON.readValue(error.andReturn().getResponse().getContentAsString(),
					new TypeReference<>() {
					});
			assertThat(body).containsEntry("timestamp", now);
		}
	}

	/** Five messages from each of ten addresses: the 50 of the cap. */
	void fillTheCap() throws Exception {
		for (int i = 1; i <= 50; i++) {
			send(body(), "198.51.100." + ((i % 10) + 1)).andExpect(status().isAccepted());
		}
	}

	@Test
	void theCharsetParameterIsAccepted() throws Exception {
		this.mockMvc.perform(e02().contentType("application/json;charset=UTF-8").content(body()))
			.andExpect(status().isAccepted());
	}

	/** Each reason of each field: absent, null, empty or blank; too long; a line break; an invalid address. */
	static Stream<Arguments> reasons() {
		Stream.Builder<Arguments> reasons = Stream.builder();
		for (String field : List.of("lastName", "firstName", "email", "subject", "message")) {
			for (Object blank : new Object[] { ABSENT, null, "", " \u3000\t\u00A0" }) {
				reasons.add(arguments(field, blank, "required"));
			}
		}
		for (String field : List.of("lastName", "firstName", "subject")) {
			reasons.add(arguments(field, "x".repeat(101), "too-long"));
			for (int lineBreak : new int[] { 0x000A, 0x000D, 0x0085, 0x2028, 0x2029 }) {
				reasons.add(arguments(field, "a" + Character.toString(lineBreak) + "b", "line-break"));
			}
		}
		reasons.add(arguments("message", "m".repeat(5001), "too-long"));
		reasons.add(arguments("email", "a".repeat(64) + "@" + ("b".repeat(60) + ".").repeat(3) + "c".repeat(7), "too-long"));
		for (String address : List.of("visiteur" + "@" + "exemple", "sans-arobase", "élise" + "@" + "exemple.fr",
				"visiteur\n" + "@" + "exemple.fr", "visiteur(at)exemple")) {
			reasons.add(arguments("email", address, "invalid-email"));
		}
		return reasons.build();
	}

	@ParameterizedTest
	@MethodSource("reasons")
	void aFieldInQuestionGetsItsReasonAndNothingIsHandedOver(String field, Object value, String reason)
			throws Exception {
		send(body(field, value)).andExpect(invalidFields(Map.of(field, reason)));
		verify(this.messageSender, never()).send(any());
	}

	@Test
	void theKeysFollowTheOrderOfTheForm() throws Exception {
		send(body("message", "  ", "subject", "a\nb", "email", "sans-arobase", "firstName", "p".repeat(101), "lastName",
				"")).andExpect(invalidFields(map("lastName", "required", "firstName", "too-long", "email",
						"invalid-email", "subject", "line-break", "message", "required")));
		// The example of the contract.
		send(body("subject", "", "email", "visiteur(at)exemple"))
			.andExpect(invalidFields(map("email", "invalid-email", "subject", "required")));
		verify(this.messageSender, never()).send(any());
	}

	/** Malformed JSON, empty body, a body that is not an object, a value neither a string nor null, 64 KiB. */
	static Stream<String> unreadableBodies() {
		return Stream.of("{\"lastName\": \"Nom\",", "", "[]", "\"texte\"", "12", "null", "{\"lastName\":\"Nom\"} x",
				body("lastName", 12), body("email", true), body("subject", List.of("a")), body("message", Map.of("a", "b")),
				body("website", false), body("formToken", 3), body("message", "m".repeat(70_000)));
	}

	@ParameterizedTest
	@MethodSource("unreadableBodies")
	void anUnreadableBodyGetsThe400WithoutValidationErrors(String body) throws Exception {
		send(body).andExpect(SECURITY_HEADERS)
			.andExpect(error(400, "The request body could not be read."));
		verify(this.messageSender, never()).send(any());
	}

	@Test
	void theOtherErrorsFollowTheContractFormat() throws Exception {
		this.mockMvc.perform(e02().contentType(TEXT_PLAIN).content(body()))
			.andExpect(error(415, "The request content type is not supported."))
			.andExpect(SECURITY_HEADERS);
		this.mockMvc.perform(e02().contentType(APPLICATION_JSON).accept(TEXT_HTML).content(body()))
			.andExpect(error(406, "The requested response type is not supported."))
			.andExpect(SECURITY_HEADERS);
		this.mockMvc.perform(get(ROUTE).header(ORIGIN, ALLOWED))
			.andExpect(error(405, "The request method is not supported."))
			.andExpect(header().string(ALLOW, "POST"));
		verify(this.messageSender, never()).send(any());
	}

	@Test
	void aRefusalRaisedDuringTheSendingGetsTheSingle503() throws Exception {
		willThrow(new ContactUnavailableException()).given(this.messageSender).send(any());
		send(body()).andExpect(error(503, "The service is temporarily unavailable."))
			.andExpect(SECURITY_HEADERS);
	}

	/** A failure of the provider, answered or not, and a timeout: the same 503, the message handed once. */
	static Stream<SendFailedException> providerFailures() {
		return Stream.of(new SendFailedException(Kind.FAILURE, 401), new SendFailedException(Kind.FAILURE, null),
				new SendFailedException(Kind.TIMEOUT, null));
	}

	@ParameterizedTest
	@MethodSource("providerFailures")
	void aFailureOfTheProviderGetsTheSingle503(SendFailedException failure) throws Exception {
		willThrow(failure).given(this.messageSender).send(any());
		send(body()).andExpect(error(503, "The service is temporarily unavailable."))
			.andExpect(SECURITY_HEADERS)
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED));
		verify(this.messageSender).send(any());
	}

	@Test
	void aForeignOriginGetsThe403AndNothingIsHandedOver() throws Exception {
		this.mockMvc
			.perform(post(ROUTE).header(ORIGIN, "https://autre.example").contentType(APPLICATION_JSON).content(body()))
			.andExpect(error(403, "The request is not allowed."))
			.andExpect(SECURITY_HEADERS)
			.andExpect(header().doesNotExist(ACCESS_CONTROL_ALLOW_ORIGIN));
		this.mockMvc.perform(preflight("https://autre.example")).andExpect(error(403, "The request is not allowed."));
		verify(this.messageSender, never()).send(any());
	}

	@Test
	void thePreflightOfTheAllowedOriginGetsTheContractHeaders() throws Exception {
		this.mockMvc.perform(preflight(ALLOWED))
			.andExpect(status().isOk())
			.andExpect(content().string(""))
			.andExpect(SECURITY_HEADERS)
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED))
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_METHODS, "POST"))
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_HEADERS, "content-type"))
			.andExpect(header().string(ACCESS_CONTROL_MAX_AGE, "1800"));
	}

	@Test
	void aRequestWithoutOriginIsProcessed() throws Exception {
		this.mockMvc.perform(post(ROUTE).contentType(APPLICATION_JSON).content(body()))
			.andExpect(status().isAccepted())
			.andExpect(header().doesNotExist(ACCESS_CONTROL_ALLOW_ORIGIN));
		verify(this.messageSender).send(any());
	}

	/** A valid body, whose listed properties are replaced, {@link #ABSENT} removing one. */
	static String body(Object... replacements) {
		Map<String, Object> body = map("lastName", "Nom", "firstName", "Prénom", "email", ADDRESS, "subject", "Sujet",
				"message", "Bonjour,\nmerci.", "website", "", "formToken", token);
		for (int i = 0; i < replacements.length; i += 2) {
			if (replacements[i + 1] == ABSENT) {
				body.remove((String) replacements[i]);
			}
			else {
				body.put((String) replacements[i], replacements[i + 1]);
			}
		}
		return JSON.writeValueAsString(body);
	}

	@SuppressWarnings("unchecked")
	static <V> Map<String, V> map(Object... entries) {
		Map<String, V> map = new LinkedHashMap<>();
		for (int i = 0; i < entries.length; i += 2) {
			map.put((String) entries[i], (V) entries[i + 1]);
		}
		return map;
	}

	ResultActions send(String body) throws Exception {
		return this.mockMvc.perform(e02().contentType(APPLICATION_JSON).content(body));
	}

	/** From the visitor's address, the last of the list the proxy appends to. */
	ResultActions send(String body, String forwardedFor) throws Exception {
		return this.mockMvc
			.perform(e02().header("X-Forwarded-For", forwardedFor).contentType(APPLICATION_JSON).content(body));
	}

	static MockHttpServletRequestBuilder e02() {
		return post(ROUTE).accept(APPLICATION_JSON).header(ORIGIN, ALLOWED);
	}

	static MockHttpServletRequestBuilder preflight(String origin) {
		return options(ROUTE).header(ORIGIN, origin)
			.header(ACCESS_CONTROL_REQUEST_METHOD, "POST")
			.header(ACCESS_CONTROL_REQUEST_HEADERS, "content-type");
	}

	/** The single 503 of E-02, with the security headers; its body, without the timestamp. */
	static String unavailable(ResultActions sending) throws Exception {
		return sending.andExpect(error(503, "The service is temporarily unavailable."))
			.andExpect(SECURITY_HEADERS)
			.andReturn()
			.getResponse()
			.getContentAsString()
			.replaceFirst("\"timestamp\":\"[^\"]*\"", "");
	}

	/** Every header of a response, with all its values. */
	static Map<String, List<String>> headers(MockHttpServletResponse response) {
		Map<String, List<String>> headers = new LinkedHashMap<>();
		response.getHeaderNames().forEach((name) -> headers.put(name, response.getHeaders(name)));
		return headers;
	}

	/** The contract's error, with validationErrors at null, as the response's code and in its body. */
	static ResultMatcher error(int code, String message) {
		return (result) -> {
			status().is(code).match(result);
			errorBody(code, message, ROUTE).match(result);
		};
	}

	/** The validation 400: the six properties, and exactly these reasons, in this order. */
	static ResultMatcher invalidFields(Map<String, String> reasons) {
		return (result) -> {
			status().isBadRequest().match(result);
			SECURITY_HEADERS.match(result);
			assertThat(result.getResponse().getContentType()).isEqualTo(APPLICATION_JSON_VALUE);
			Map<String, Object> body = JSON.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {
			});
			assertThat(body.keySet()).containsExactly("status", "error", "message", "timestamp", "path",
					"validationErrors");
			assertThat(body).containsEntry("status", 400)
				.containsEntry("error", "Bad Request")
				.containsEntry("message", "One or more fields are invalid.")
				.containsEntry("path", ROUTE);
			@SuppressWarnings("unchecked")
			Map<String, Object> validationErrors = (Map<String, Object>) body.get("validationErrors");
			assertThat(validationErrors).containsExactlyEntriesOf(reasons);
		};
	}

}
