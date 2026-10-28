package io.github.milkliz0rd.portfolio.web;

import static io.github.milkliz0rd.portfolio.web.ApiTestController.BODY;
import static io.github.milkliz0rd.portfolio.web.ApiTestController.OK;
import static io.github.milkliz0rd.portfolio.web.ContractResults.SECURITY_HEADERS;
import static io.github.milkliz0rd.portfolio.web.ContractResults.errorBody;
import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN;
import static org.springframework.http.HttpHeaders.ALLOW;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.http.MediaType.TEXT_PLAIN;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.stream.Stream;

import jakarta.servlet.RequestDispatcher;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;

/** The error format and the security headers (TK-67), on a test controller under /api/v1/: PB-06. */
@WebMvcTest
@Import(ApiTestController.class)
class ErrorFormatTest {

	@Autowired
	private MockMvc mockMvc;

	static Stream<Arguments> successes() {
		return Stream.of(arguments(get(OK), 200),
				arguments(post(BODY).contentType(APPLICATION_JSON).content("{}"), 202));
	}

	@ParameterizedTest
	@MethodSource("successes")
	void aSuccessCarriesTheSecurityHeaders(RequestBuilder request, int status) throws Exception {
		this.mockMvc.perform(request).andExpect(status().is(status)).andExpect(SECURITY_HEADERS);
	}

	static Stream<Arguments> errors() {
		return Stream.of(
				arguments(get("/api/v1/missing?query=1"), 404, "The requested resource does not exist.", "/api/v1/missing"),
				arguments(delete(OK), 405, "The request method is not supported.", OK),
				arguments(get(OK).accept(TEXT_PLAIN), 406, "The requested response type is not supported.", OK),
				arguments(post(BODY).contentType(TEXT_PLAIN).content("text"), 415,
						"The request content type is not supported.", BODY),
				arguments(get("/api/v1/test/failure"), 500, "An unexpected error occurred.", "/api/v1/test/failure"),
				arguments(get("/error").requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 500)
					.requestAttr(RequestDispatcher.ERROR_REQUEST_URI, OK), 500, "An unexpected error occurred.", OK));
	}

	@ParameterizedTest
	@MethodSource("errors")
	void anErrorFollowsTheContractFormat(RequestBuilder request, int status, String message, String path)
			throws Exception {
		this.mockMvc.perform(request)
			.andExpect(status().is(status))
			.andExpect(SECURITY_HEADERS)
			.andExpect(header().doesNotExist(ACCESS_CONTROL_ALLOW_ORIGIN))
			.andExpect(errorBody(status, message, path));
	}

	@Test
	void anUnsupportedMethodNamesTheSupportedOnes() throws Exception {
		this.mockMvc.perform(delete(OK)).andExpect(header().string(ALLOW, containsString("GET")));
	}

}
