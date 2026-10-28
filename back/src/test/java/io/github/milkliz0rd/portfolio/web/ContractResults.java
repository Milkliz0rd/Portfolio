package io.github.milkliz0rd.portfolio.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

import java.util.Map;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.ResultMatcher;

/** What the contract asks of every response: its security headers (section 1), its error format (section 4). */
final class ContractResults {

	static final ResultMatcher SECURITY_HEADERS = (result) -> {
		header().string(HttpHeaders.CACHE_CONTROL, "no-store").match(result);
		header().string("X-Content-Type-Options", "nosniff").match(result);
		header().string("Content-Security-Policy", "frame-ancestors 'none'").match(result);
		header().doesNotExist("Retry-After").match(result);
	};

	private static final JsonMapper JSON_MAPPER = JsonMapper.builder().build();

	private ContractResults() {
	}

	/** Exactly the six properties of the error format, in JSON, with {@code validationErrors} at null. */
	static ResultMatcher errorBody(int status, String message, String path) {
		return (result) -> {
			assertThat(result.getResponse().getContentType()).isEqualTo(APPLICATION_JSON_VALUE);
			Map<String, Object> body = JSON_MAPPER.readValue(result.getResponse().getContentAsString(),
					new TypeReference<>() {
					});
			assertThat(body.keySet()).containsExactly("status", "error", "message", "timestamp", "path",
					"validationErrors");
			assertThat(body).containsEntry("status", status)
				.containsEntry("error", HttpStatus.valueOf(status).getReasonPhrase())
				.containsEntry("message", message)
				.containsEntry("path", path)
				.containsEntry("validationErrors", null);
			assertThat((String) body.get("timestamp")).matches("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z");
		};
	}

}
