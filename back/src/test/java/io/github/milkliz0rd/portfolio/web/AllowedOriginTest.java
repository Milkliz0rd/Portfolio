package io.github.milkliz0rd.portfolio.web;

import static io.github.milkliz0rd.portfolio.web.ApiTestController.BODY;
import static io.github.milkliz0rd.portfolio.web.ApiTestController.OK;
import static io.github.milkliz0rd.portfolio.web.ContractResults.SECURITY_HEADERS;
import static io.github.milkliz0rd.portfolio.web.ContractResults.errorBody;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_MAX_AGE;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD;
import static org.springframework.http.HttpHeaders.ORIGIN;
import static org.springframework.http.HttpHeaders.VARY;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.stream.Stream;

import io.github.milkliz0rd.portfolio.config.ContactProperties;
import io.github.milkliz0rd.portfolio.service.ContactService;
import io.github.milkliz0rd.portfolio.service.FormTokenService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import tools.jackson.databind.json.JsonMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

/** The allowed origin (TK-67), on a test controller under /api/v1/: contract, section 1; PB-06. */
@WebMvcTest(properties = "contact.allowed-origins=http://localhost:4200, https://www.site.example")
@Import(ApiTestController.class)
class AllowedOriginTest {

	private static final String ALLOWED = "http://localhost:4200";

	private static final String FOREIGN = "https://foreign.example";

	@Autowired
	private MockMvc mockMvc;

	/** Needed by the controller of E-02, which the slice loads too; unused here. */
	@MockitoBean
	private ContactService contactService;

	/** Needed by the controller of E-01, which the slice loads too; unused here. */
	@MockitoBean
	private FormTokenService formTokenService;

	@Autowired
	private JsonMapper jsonMapper;

	static Stream<Arguments> refusals() {
		return Stream.of(arguments(get(OK).header(ORIGIN, FOREIGN), OK),
				arguments(preflight(URI.create(BODY), FOREIGN), BODY),
				// Refused before any other processing: not a 404.
				arguments(get("/api/v1/missing").header(ORIGIN, FOREIGN), "/api/v1/missing"));
	}

	@ParameterizedTest
	@MethodSource("refusals")
	void aForeignOriginGetsTheContract403(RequestBuilder request, String path) throws Exception {
		this.mockMvc.perform(request).andExpect(forbidden(path));
	}

	/** Paths Spring MVC matches to the test controller; built from a URI, so that "%" is not encoded again. */
	static Stream<Arguments> equivalentPaths() {
		return Stream.of(
				arguments(get(URI.create("/api;x=1/v1/test/ok")).header(ORIGIN, FOREIGN), "/api;x=1/v1/test/ok"),
				arguments(get(URI.create("/api/v%31/test/ok")).header(ORIGIN, FOREIGN), "/api/v%31/test/ok"),
				arguments(preflight(URI.create("/api;x=1/v1/test/body"), FOREIGN), "/api;x=1/v1/test/body"));
	}

	@ParameterizedTest
	@MethodSource("equivalentPaths")
	void aForeignOriginIsRefusedOnAnEquivalentPath(RequestBuilder request, String path) throws Exception {
		this.mockMvc.perform(request).andExpect(forbidden(path));
	}

	@Test
	void anAllowedPreflightGetsExactlyTheContractHeaders() throws Exception {
		this.mockMvc.perform(preflight(URI.create(BODY), ALLOWED))
			.andExpect(status().isOk())
			.andExpect(SECURITY_HEADERS)
			.andExpect(content().string(""))
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED))
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_METHODS, "POST"))
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_HEADERS, "content-type"))
			.andExpect(header().string(ACCESS_CONTROL_MAX_AGE, "1800"))
			.andExpect(header().stringValues(VARY, "Origin"))
			.andExpect(header().doesNotExist(ACCESS_CONTROL_ALLOW_CREDENTIALS));
	}

	@ParameterizedTest
	@CsvSource({ "http://localhost:4200, /api/v1/test/ok, 200", "https://www.site.example, /api/v1/test/ok, 200",
			"http://localhost:4200, /api/v1/missing, 404" })
	void anAllowedOriginGetsItselfBack(String origin, String path, int status) throws Exception {
		this.mockMvc.perform(get(path).header(ORIGIN, origin))
			.andExpect(status().is(status))
			.andExpect(header().string(ACCESS_CONTROL_ALLOW_ORIGIN, origin))
			.andExpect(header().stringValues(VARY, "Origin"))
			.andExpect(header().doesNotExist(ACCESS_CONTROL_ALLOW_CREDENTIALS));
	}

	@Test
	void aRequestWithoutOriginIsProcessed() throws Exception {
		this.mockMvc.perform(post(BODY).contentType(APPLICATION_JSON).content("{}"))
			.andExpect(status().isAccepted())
			.andExpect(header().doesNotExist(ACCESS_CONTROL_ALLOW_ORIGIN));
	}

	@Test
	void anEmptyListAcceptsNoBrowserOrigin() throws Exception {
		AllowedOriginFilter filter = new AllowedOriginFilter(
				new ContactProperties(List.of(), Duration.ofSeconds(3), Duration.ofHours(2), Duration.ofSeconds(10),
						"https://api.brevo.com/v3"),
				this.jsonMapper);
		MockHttpServletRequest request = new MockHttpServletRequest("GET", OK);
		request.addHeader(ORIGIN, ALLOWED);
		MockHttpServletResponse response = new MockHttpServletResponse();
		filter.doFilter(request, response, new MockFilterChain());
		assertThat(response.getStatus()).isEqualTo(403);
	}

	/** The contract's 403, with the security headers and without any CORS header for the foreign origin. */
	private static ResultMatcher forbidden(String path) {
		return (result) -> {
			status().isForbidden().match(result);
			SECURITY_HEADERS.match(result);
			header().doesNotExist(ACCESS_CONTROL_ALLOW_ORIGIN).match(result);
			errorBody(403, "The request is not allowed.", path).match(result);
		};
	}

	private static MockHttpServletRequestBuilder preflight(URI uri, String origin) {
		return options(uri).header(ORIGIN, origin)
			.header(ACCESS_CONTROL_REQUEST_METHOD, "POST")
			.header(ACCESS_CONTROL_REQUEST_HEADERS, "content-type");
	}

}
