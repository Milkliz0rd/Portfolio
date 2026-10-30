package io.github.milkliz0rd.portfolio.web;

import static io.github.milkliz0rd.portfolio.controller.ContactMessageController.ROUTE;
import static io.github.milkliz0rd.portfolio.web.ContractResults.SECURITY_HEADERS;
import static io.github.milkliz0rd.portfolio.web.ContractResults.errorBody;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;
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

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import io.github.milkliz0rd.portfolio.exception.ContactUnavailableException;
import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.SendFailedException;
import io.github.milkliz0rd.portfolio.sender.SendFailedException.Kind;
import io.github.milkliz0rd.portfolio.service.ContactService;
import io.github.milkliz0rd.portfolio.service.FormTokenService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

/**
 * E-02 through the HTTP foundation, in a web slice: the real controller, filters, validation, error
 * handler and contact service; only the message sender is simulated (PB-07).
 */
@WebMvcTest(properties = "contact.allowed-origins=https://www.site.example")
@Import(ContactService.class)
class ContactMessageEndpointTest {

	static final String ALLOWED = "https://www.site.example";

	static final String ADDRESS = "visiteur" + "@" + "exemple.fr";

	/** Removes a property from the body. */
	static final Object ABSENT = new Object();

	private static final JsonMapper JSON = JsonMapper.builder().build();

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private MessageSender messageSender;

	/** Needed by the controller of E-01, which the slice loads too; unused here. */
	@MockitoBean
	private FormTokenService formTokenService;

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

	/** The honeypot and the token are read, and judged by the filter chain only (TK-18, TK-22). */
	static Stream<Arguments> honeypotsAndTokens() {
		return Stream.of(arguments("website", "http://robot.example"), arguments("website", null),
				arguments("formToken", null), arguments("formToken", ABSENT), arguments("formToken", ""));
	}

	@ParameterizedTest
	@MethodSource("honeypotsAndTokens")
	void theHoneypotAndTheTokenDoNotYetChangeTheAnswer(String property, Object value) throws Exception {
		send(body(property, value)).andExpect(status().isAccepted());
		verify(this.messageSender).send(any());
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
				"message", "Bonjour,\nmerci.", "website", "", "formToken", "jeton-opaque");
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

	static MockHttpServletRequestBuilder e02() {
		return post(ROUTE).accept(APPLICATION_JSON).header(ORIGIN, ALLOWED);
	}

	static MockHttpServletRequestBuilder preflight(String origin) {
		return options(ROUTE).header(ORIGIN, origin)
			.header(ACCESS_CONTROL_REQUEST_METHOD, "POST")
			.header(ACCESS_CONTROL_REQUEST_HEADERS, "content-type");
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
