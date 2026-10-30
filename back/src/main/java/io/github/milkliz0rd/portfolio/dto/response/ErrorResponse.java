package io.github.milkliz0rd.portfolio.dto.response;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.jspecify.annotations.Nullable;

import org.springframework.http.HttpStatus;

/**
 * The single error format of the contract (section 4): exactly six properties, always written,
 * {@code validationErrors} included when it is {@code null}.
 */
@JsonInclude(JsonInclude.Include.ALWAYS)
@JsonPropertyOrder({ "status", "error", "message", "timestamp", "path", "validationErrors" })
public record ErrorResponse(int status, String error, String message, Instant timestamp, String path,
		@Nullable Map<String, String> validationErrors) {

	public ErrorResponse {
		validationErrors = (validationErrors != null)
				? Collections.unmodifiableMap(new LinkedHashMap<>(validationErrors)) : null;
	}

	/** The error for {@code status} on {@code path}, with the generic message the plan fixes for it. */
	public static ErrorResponse of(HttpStatus status, String path) {
		return new ErrorResponse(status.value(), status.getReasonPhrase(), messageFor(status),
				Instant.now().truncatedTo(ChronoUnit.SECONDS), path, null);
	}

	/** The validation refusal of E-02: the reason of each field in question, in the order of the form. */
	public static ErrorResponse invalidFields(String path, Map<String, String> validationErrors) {
		return new ErrorResponse(400, HttpStatus.BAD_REQUEST.getReasonPhrase(), "One or more fields are invalid.",
				Instant.now().truncatedTo(ChronoUnit.SECONDS), path, validationErrors);
	}

	private static String messageFor(HttpStatus status) {
		return switch (status) {
			case BAD_REQUEST -> "The request body could not be read.";
			case FORBIDDEN -> "The request is not allowed.";
			case NOT_FOUND -> "The requested resource does not exist.";
			case METHOD_NOT_ALLOWED -> "The request method is not supported.";
			case NOT_ACCEPTABLE -> "The requested response type is not supported.";
			case UNSUPPORTED_MEDIA_TYPE -> "The request content type is not supported.";
			case INTERNAL_SERVER_ERROR -> "An unexpected error occurred.";
			default -> "The request could not be processed.";
		};
	}

}
