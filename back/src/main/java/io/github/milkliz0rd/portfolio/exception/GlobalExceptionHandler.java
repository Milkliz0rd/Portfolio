package io.github.milkliz0rd.portfolio.exception;

import io.github.milkliz0rd.portfolio.dto.response.ErrorResponse;
import org.jspecify.annotations.Nullable;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * The single global error handler (PB-06): every exception Spring MVC knows keeps its HTTP code,
 * headers included ({@code Allow} on a 405), and gets the contract's error format in
 * {@code application/json}, whatever the {@code Accept} header; any other exception is a 500.
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

	@Override
	protected @Nullable ResponseEntity<Object> handleExceptionInternal(Exception ex, @Nullable Object body,
			HttpHeaders headers, HttpStatusCode statusCode, WebRequest request) {
		HttpHeaders jsonHeaders = HttpHeaders.copyOf(headers);
		jsonHeaders.setContentType(MediaType.APPLICATION_JSON);
		String path = (request instanceof ServletWebRequest servletRequest)
				? servletRequest.getRequest().getRequestURI() : "";
		ErrorResponse error = ErrorResponse.of(HttpStatus.valueOf(statusCode.value()), path);
		return super.handleExceptionInternal(ex, error, jsonHeaders, statusCode, request);
	}

}
