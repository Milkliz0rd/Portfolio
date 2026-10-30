package io.github.milkliz0rd.portfolio.web;

import static io.github.milkliz0rd.portfolio.web.ApiTestController.BODY;
import static io.github.milkliz0rd.portfolio.web.ContractResults.SECURITY_HEADERS;
import static io.github.milkliz0rd.portfolio.web.ContractResults.errorBody;
import static io.github.milkliz0rd.portfolio.web.RequestSizeLimitFilter.MAX_BODY_BYTES;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN;
import static org.springframework.http.HttpHeaders.ORIGIN;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.TEXT_PLAIN;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.net.URI;
import java.nio.charset.StandardCharsets;

import io.github.milkliz0rd.portfolio.service.ContactService;
import io.github.milkliz0rd.portfolio.service.FormTokenService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;

/** The request body bounded to 64 KiB (TK-67), on a test controller under /api/v1/: PB-06. */
@WebMvcTest
@Import(ApiTestController.class)
class RequestSizeLimitTest {

	private static final String UNREADABLE = "The request body could not be read.";

	@Autowired
	private MockMvc mockMvc;

	/** Needed by the controller of E-02, which the slice loads too; unused here. */
	@MockitoBean
	private ContactService contactService;

	/** Needed by the controller of E-01, which the slice loads too; unused here. */
	@MockitoBean
	private FormTokenService formTokenService;

	@ParameterizedTest
	@ValueSource(booleans = { true, false })
	void aBodyOfExactly64KiBIsRead(boolean announced) throws Exception {
		this.mockMvc.perform(body(BODY, json(MAX_BODY_BYTES), announced)).andExpect(status().isAccepted());
	}

	@ParameterizedTest
	@ValueSource(booleans = { true, false })
	void aLargerBodyGetsTheUnreadableBody400(boolean announced) throws Exception {
		this.mockMvc.perform(body(BODY, json(MAX_BODY_BYTES + 1), announced))
			.andExpect(status().isBadRequest())
			.andExpect(SECURITY_HEADERS)
			.andExpect(errorBody(400, UNREADABLE, BODY));
	}

	/** Paths Spring MVC matches to the test controller, sent as raw URIs. */
	@ParameterizedTest
	@CsvSource({ "/api;x=1/v1/test/body, true", "/api;x=1/v1/test/body, false", "/api/v%31/test/body, true",
			"/api/v%31/test/body, false" })
	void aLargerBodyOnAnEquivalentPathGetsTheUnreadableBody400(String path, boolean announced) throws Exception {
		this.mockMvc.perform(body(path, json(MAX_BODY_BYTES + 1), announced))
			.andExpect(status().isBadRequest())
			.andExpect(SECURITY_HEADERS)
			.andExpect(errorBody(400, UNREADABLE, path));
	}

	@Test
	void aForeignOriginIsRefusedBeforeTheBodyIsChecked() throws Exception {
		// Refused before any other processing: neither a 415, nor a 400.
		this.mockMvc
			.perform(post(BODY).header(ORIGIN, "https://foreign.example")
				.contentType(TEXT_PLAIN)
				.content(json(MAX_BODY_BYTES + 1)))
			.andExpect(status().isForbidden())
			.andExpect(SECURITY_HEADERS)
			.andExpect(header().doesNotExist(ACCESS_CONTROL_ALLOW_ORIGIN))
			.andExpect(errorBody(403, "The request is not allowed.", BODY));
	}

	/** A JSON object of exactly {@code size} bytes. */
	private static byte[] json(int size) {
		return ("{\"padding\":\"" + "a".repeat(size - 14) + "\"}").getBytes(StandardCharsets.UTF_8);
	}

	/**
	 * The body on the raw path, never encoded again, with its length announced or, as a chunked body
	 * would be, not.
	 */
	private static RequestBuilder body(String path, byte[] content, boolean announced) {
		if (announced) {
			return post(URI.create(path)).contentType(APPLICATION_JSON).content(content);
		}
		return (servletContext) -> {
			MockHttpServletRequest request = new MockHttpServletRequest(servletContext, "POST", path) {
				@Override
				public long getContentLengthLong() {
					return -1;
				}

				@Override
				public int getContentLength() {
					return -1;
				}
			};
			request.setContentType(APPLICATION_JSON_VALUE);
			request.setContent(content);
			return request;
		};
	}

}
