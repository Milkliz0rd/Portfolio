package io.github.milkliz0rd.portfolio.web;

import static io.github.milkliz0rd.portfolio.controller.FormTokenController.ROUTE;
import static io.github.milkliz0rd.portfolio.service.FormTokenService.Verification.TOO_RECENT;
import static io.github.milkliz0rd.portfolio.service.FormTokenService.Verification.VALID;
import static io.github.milkliz0rd.portfolio.web.ContractResults.SECURITY_HEADERS;
import static io.github.milkliz0rd.portfolio.web.ContractResults.errorBody;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_MAX_AGE;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD;
import static org.springframework.http.HttpHeaders.ALLOW;
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
import java.time.Instant;
import java.util.Map;
import java.util.stream.Stream;

import io.github.milkliz0rd.portfolio.MutableClock;
import io.github.milkliz0rd.portfolio.TestSecrets;
import io.github.milkliz0rd.portfolio.service.ContactService;
import io.github.milkliz0rd.portfolio.service.FormTokenService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

/**
 * E-01 through the HTTP foundation, in a web slice: the real controller, filters, error handler and
 * FormTokenService, with a secret drawn by the test and a clock it moves (PB-07). The delays are
 * 1500 ms and 7199999 ms, so that the response shows its roundings.
 */
@WebMvcTest(properties = { "contact.allowed-origins=https://www.site.example", "contact.token-min-age=1500ms",
		"contact.token-max-age=7199999ms" })
@Import(FormTokenService.class)
@ExtendWith(OutputCaptureExtension.class)
class FormTokenEndpointTest {

	private static final String ALLOWED = "https://www.site.example";

	private static final String FOREIGN = "https://autre.example";

	private static final String SECRET = TestSecrets.draw(32);

	private static final JsonMapper JSON = JsonMapper.builder().build();

	@DynamicPropertySource
	static void tokenSecret(DynamicPropertyRegistry registry) {
		registry.add("contact.token-secret", () -> SECRET);
	}

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private FormTokenService formTokenService;

	@Autowired
	private MutableClock clock;

	/** Needed by the controller of E-02, which the slice loads too; unused here. */
	@MockitoBean
	private ContactService contactService;

	@Test
	void anAllowedOriginGetsATokenAndItsDelays() throws Exception {
		MockHttpServletResponse response = this.mockMvc.perform(e01())
			.andExpect(status().isOk())
			.andExpect(SECURITY_HEADERS)
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED))
			.andExpect(header().stringValues(VARY, "Origin"))
			.andExpect(header().doesNotExist(ACCESS_CONTROL_ALLOW_CREDENTIALS))
			.andReturn()
			.getResponse();
		Map<String, Object> body = body(response);
		assertThat(body.keySet()).containsExactly("formToken", "minDelaySeconds", "expiresInSeconds");
		// 1500 ms rounded up to 2 s, 7199999 ms rounded down to 7199 s.
		assertThat(body).containsEntry("minDelaySeconds", 2).containsEntry("expiresInSeconds", 7199);
		String token = (String) body.get("formToken");
		assertThat(this.formTokenService.verify(token)).isEqualTo(TOO_RECENT);
		this.clock.advance(Duration.ofMillis(1500));
		assertThat(this.formTokenService.verify(token)).isEqualTo(VALID);
	}

	@Test
	void eachCallGetsAnotherToken() throws Exception {
		assertThat(body(this.mockMvc.perform(e01()).andReturn().getResponse()).get("formToken"))
			.isNotEqualTo(body(this.mockMvc.perform(e01()).andReturn().getResponse()).get("formToken"));
	}

	/** Without Origin nor Accept, as a script calls it; a body or a content type, ignored, refuses nothing. */
	static Stream<Arguments> otherCalls() {
		return Stream.of(arguments(post(ROUTE), null),
				arguments(e01().contentType(APPLICATION_JSON).content("{\"formToken\":3}"), ALLOWED),
				arguments(e01().contentType(TEXT_PLAIN).content("texte"), ALLOWED));
	}

	@ParameterizedTest
	@MethodSource("otherCalls")
	void anyPostGetsAToken(RequestBuilder request, String allowOrigin) throws Exception {
		MockHttpServletResponse response = this.mockMvc.perform(request).andReturn().getResponse();
		assertThat(response.getStatus()).isEqualTo(200);
		assertThat((String) body(response).get("formToken")).hasSize(79);
		assertThat(response.getHeader(ACCESS_CONTROL_ALLOW_ORIGIN)).isEqualTo(allowOrigin);
	}

	static Stream<Arguments> errors() {
		return Stream.of(arguments(get(ROUTE), 405, "The request method is not supported."),
				arguments(post(ROUTE).accept(TEXT_HTML), 406, "The requested response type is not supported."),
				arguments(post(ROUTE).accept(APPLICATION_JSON).header(ORIGIN, FOREIGN), 403, "The request is not allowed."),
				arguments(preflight(FOREIGN), 403, "The request is not allowed."));
	}

	@ParameterizedTest
	@MethodSource("errors")
	void anErrorFollowsTheContractFormat(RequestBuilder request, int status, String message) throws Exception {
		this.mockMvc.perform(request)
			.andExpect(status().is(status))
			.andExpect(SECURITY_HEADERS)
			.andExpect(header().doesNotExist(ACCESS_CONTROL_ALLOW_ORIGIN))
			.andExpect(errorBody(status, message, ROUTE))
			.andExpect((status == 405) ? header().string(ALLOW, "POST") : (result) -> {
			});
	}

	@Test
	void thePreflightIsAnsweredAsForE02() throws Exception {
		this.mockMvc.perform(preflight(ALLOWED))
			.andExpect(status().isOk())
			.andExpect(content().string(""))
			.andExpect(SECURITY_HEADERS)
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED))
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_METHODS, "POST"))
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_HEADERS, "content-type"))
			.andExpect(header().string(ACCESS_CONTROL_MAX_AGE, "1800"));
	}

	/** Neither the contact-message line of E-02, served or refused, nor the token or the secret (PB-05). */
	@Test
	void e01LogsNoLineNorTokenNorSecret(CapturedOutput output) throws Exception {
		Object token = body(this.mockMvc.perform(e01()).andReturn().getResponse()).get("formToken");
		this.mockMvc.perform(post(ROUTE).header(ORIGIN, FOREIGN));
		this.mockMvc.perform(preflight(ALLOWED));
		assertThat(output.getAll()).doesNotContain("contact-message")
			.doesNotContain((String) token)
			.doesNotContain(SECRET);
	}

	/** The JSON body of a 200 of E-01, in its own type. */
	private static Map<String, Object> body(MockHttpServletResponse response) throws Exception {
		assertThat(response.getContentType()).isEqualTo(APPLICATION_JSON_VALUE);
		return JSON.readValue(response.getContentAsString(), new TypeReference<>() {
		});
	}

	static MockHttpServletRequestBuilder e01() {
		return post(ROUTE).accept(APPLICATION_JSON).header(ORIGIN, ALLOWED);
	}

	static MockHttpServletRequestBuilder preflight(String origin) {
		return options(ROUTE).header(ORIGIN, origin).header(ACCESS_CONTROL_REQUEST_METHOD, "POST");
	}

	/** Found as a nested test configuration: the clock of the slice, which the tests move. */
	@TestConfiguration(proxyBeanMethods = false)
	static class TestClock {

		@Bean
		MutableClock clock() {
			return new MutableClock(Instant.parse("2026-10-30T10:00:00Z"));
		}

	}

}
