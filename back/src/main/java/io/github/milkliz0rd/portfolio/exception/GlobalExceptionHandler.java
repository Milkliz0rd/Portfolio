package io.github.milkliz0rd.portfolio.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import io.github.milkliz0rd.portfolio.dto.request.ContactMessageRequest;
import io.github.milkliz0rd.portfolio.dto.response.ErrorResponse;
import io.github.milkliz0rd.portfolio.service.ContactOutcome;
import io.github.milkliz0rd.portfolio.service.ContactOutcomeLog;
import org.jspecify.annotations.Nullable;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
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
 * with {@code validationErrors} at null. A POST on E-02 that ends here gets its log line here (PB-05).
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(Exception.class)
	public @Nullable ResponseEntity<Object> handleUnexpected(Exception ex, WebRequest request) {
		return handleExceptionInternal(ex, null, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
	}

	/** The same 503 whatever its cause, which the response never tells. */
	@ExceptionHandler(ContactUnavailableException.class)
	public @Nullable ResponseEntity<Object> handleContactUnavailable(ContactUnavailableException ex,
			WebRequest request) {
		return handleExceptionInternal(ex, null, new HttpHeaders(), HttpStatus.SERVICE_UNAVAILABLE, request);
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
		if (request instanceof ServletWebRequest servletRequest) {
			ContactOutcomeLog.writeValidationRefused(servletRequest.getRequest(), reasons);
		}
		return handleExceptionInternal(ex, ErrorResponse.invalidFields(path(request), reasons), headers, status,
				request);
	}

	@Override
	protected @Nullable ResponseEntity<Object> handleExceptionInternal(Exception ex, @Nullable Object body,
			HttpHeaders headers, HttpStatusCode statusCode, WebRequest request) {
		if (request instanceof ServletWebRequest servletRequest) {
			writeOutcome(servletRequest, ex, statusCode);
		}
		HttpHeaders jsonHeaders = HttpHeaders.copyOf(headers);
		jsonHeaders.setContentType(MediaType.APPLICATION_JSON);
		ErrorResponse error = (body instanceof ErrorResponse given) ? given
				: ErrorResponse.of(HttpStatus.valueOf(statusCode.value()), path(request));
		return super.handleExceptionInternal(ex, error, jsonHeaders, statusCode, request);
	}

	/** The issue this exception means; a validation refusal and a 503 are written by whoever knows more. */
	private static void writeOutcome(ServletWebRequest request, Exception ex, HttpStatusCode statusCode) {
		ContactOutcome outcome = switch (ex) {
			case HttpMessageNotReadableException _ -> ContactOutcome.UNREADABLE_BODY;
			case HttpMediaTypeNotSupportedException _ -> ContactOutcome.UNSUPPORTED_MEDIA_TYPE;
			case HttpMediaTypeNotAcceptableException _ -> ContactOutcome.NOT_ACCEPTABLE;
			default -> (statusCode.value() == HttpStatus.INTERNAL_SERVER_ERROR.value()) ? ContactOutcome.INTERNAL_ERROR
					: null;
		};
		if (outcome == ContactOutcome.INTERNAL_ERROR) {
			ContactOutcomeLog.writeInternalError(request.getRequest(), ex);
		}
		else if (outcome != null) {
			ContactOutcomeLog.write(request.getRequest(), outcome);
		}
	}

	private static String path(WebRequest request) {
		return (request instanceof ServletWebRequest servletRequest) ? servletRequest.getRequest().getRequestURI() : "";
	}

}
