package io.github.milkliz0rd.portfolio.web;

import java.io.IOException;
import java.time.Clock;

import io.github.milkliz0rd.portfolio.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.json.JsonMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

/**
 * Writes the contract's error format from a servlet filter, outside Spring MVC, with the same JSON
 * mapper. Not a bean, so that the filters that build it load in web slice tests.
 */
final class ErrorResponseWriter {

	private final JsonMapper jsonMapper;

	private final Clock clock;

	ErrorResponseWriter(JsonMapper jsonMapper, Clock clock) {
		this.jsonMapper = jsonMapper;
		this.clock = clock;
	}

	void write(HttpServletRequest request, HttpServletResponse response, HttpStatus status)
			throws IOException {
		response.setStatus(status.value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		this.jsonMapper.writeValue(response.getOutputStream(), ErrorResponse.of(status, request.getRequestURI(), this.clock));
	}

}
