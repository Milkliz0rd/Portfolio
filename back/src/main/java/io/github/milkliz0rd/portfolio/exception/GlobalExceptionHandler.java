package io.github.milkliz0rd.portfolio.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import io.github.milkliz0rd.portfolio.dto.request.ContactMessageRequest;
import io.github.milkliz0rd.portfolio.dto.response.ErrorResponse;
import org.jspecify.annotations.Nullable;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * The single global error handler (PB-06): every exception Spring MVC knows keeps its HTTP code,
 * headers included ({@code Allow} on a 405), and gets the contract's error format in
 * {@code application/json}, whatever the {@code Accept} header; any other exception is a 500. A body
 * that cannot be read, a value that is neither a string nor null included, is the parent's 400,
 * with {@code validationErrors} at null.
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(Exception.class)
	public @Nullable ResponseEntity<Object> handleUnexpected(Exception ex, WebRequest request) {
		return handleExceptionInternal(ex, null, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
	}

	/** The parent's response, without its warning: PB-05 writes no line for this request. */
	@Override
	protected @Nullable ResponseEntity<Object> handleHttpRequestMethodNotSupported(
			HttpRequestMethodNotSupportedException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
		return handleExceptionInternal(ex, null, headers, status, request);
	}

	/**
	 * The validation refusal of E-02: one key per field in question, in the order of the form, and
	 * its reason, which the field's single constraint gives as message. Never the rejected values.
	 */
	@Override
	protected @Nullable ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatusCode status, WebRequest request) {
		Map<String, String> reasons = new LinkedHashMap<>();
		for (String field : ContactMessageRequest.FIELDS) {
			FieldError error = ex.getBindingResult().getFieldError(field);
			if (error != null && error.getDefaultMessage() != null) {
				reasons.put(field, error.getDefaultMessage());
			}
		}
		return handleExceptionInternal(ex, ErrorResponse.invalidFields(path(request), reasons), headers, status,
				request);
	}

	@Override
	protected @Nullable ResponseEntity<Object> handleExceptionInternal(Exception ex, @Nullable Object body,
			HttpHeaders headers, HttpStatusCode statusCode, WebRequest request) {
		HttpHeaders jsonHeaders = HttpHeaders.copyOf(headers);
		jsonHeaders.setContentType(MediaType.APPLICATION_JSON);
		ErrorResponse error = (body instanceof ErrorResponse given) ? given
				: ErrorResponse.of(HttpStatus.valueOf(statusCode.value()), path(request));
		return super.handleExceptionInternal(ex, error, jsonHeaders, statusCode, request);
	}

	private static String path(WebRequest request) {
		return (request instanceof ServletWebRequest servletRequest) ? servletRequest.getRequest().getRequestURI() : "";
	}

}
