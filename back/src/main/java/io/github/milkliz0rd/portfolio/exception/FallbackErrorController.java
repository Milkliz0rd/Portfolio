package io.github.milkliz0rd.portfolio.exception;

import java.util.Objects;

import io.github.milkliz0rd.portfolio.dto.response.ErrorResponse;
import io.github.milkliz0rd.portfolio.service.ContactOutcomeLog;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.boot.webmvc.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Replaces Spring Boot's error page: an error raised outside Spring MVC, in a servlet filter or by
 * the server, and forwarded to the error path gets the contract's error format too. A 500 of a POST
 * on E-02 gets its internal-error line here (PB-05).
 */
@RestController
public class FallbackErrorController implements ErrorController {

	@RequestMapping("${server.error.path:/error}")
	public ResponseEntity<ErrorResponse> error(HttpServletRequest request) {
		Object code = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
		Object uri = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
		// Called directly, without a forwarded error, the error path is not a resource.
		HttpStatus status = (code instanceof Integer value)
				? Objects.requireNonNullElse(HttpStatus.resolve(value), HttpStatus.INTERNAL_SERVER_ERROR)
				: HttpStatus.NOT_FOUND;
		String path = (uri instanceof String value) ? value : request.getRequestURI();
		if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
			ContactOutcomeLog.writeInternalError(request,
					(request.getAttribute(RequestDispatcher.ERROR_EXCEPTION) instanceof Throwable failure) ? failure : null);
		}
		return ResponseEntity.status(status)
			.contentType(MediaType.APPLICATION_JSON)
			.body(ErrorResponse.of(status, path));
	}

}
