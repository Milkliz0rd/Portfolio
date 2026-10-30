package io.github.milkliz0rd.portfolio.web;

import java.io.IOException;
import java.util.List;

import io.github.milkliz0rd.portfolio.config.ContactProperties;
import io.github.milkliz0rd.portfolio.service.ContactOutcome;
import io.github.milkliz0rd.portfolio.service.ContactOutcomeLog;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.jackson.databind.json.JsonMapper;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * The allowed origin (contract, section 1; PB-06), under {@code /api/v1/} only and before any other
 * processing there: an {@code Origin} outside {@code CONTACT_ALLOWED_ORIGINS} gets the contract's
 * 403, preflight requests included; an allowed one gets itself back, and its preflight request is
 * answered here with the contract's CORS headers. A request without {@code Origin} is processed.
 * A POST on E-02 is marked here for its log line (PB-05), and its refusal written here.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 20)
public class AllowedOriginFilter extends OncePerRequestFilter {

	private static final Logger LOGGER = LoggerFactory.getLogger(AllowedOriginFilter.class);

	private final List<String> allowedOrigins;

	private final ErrorResponseWriter errorResponseWriter;

	public AllowedOriginFilter(ContactProperties properties, JsonMapper jsonMapper) {
		this.allowedOrigins = properties.allowedOrigins();
		this.errorResponseWriter = new ErrorResponseWriter(jsonMapper);
		LOGGER.info("Allowed origins for browser calls: {}", this.allowedOrigins.size());
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		return !ApiRoutes.contains(request);
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		ContactOutcomeLog.markArrival(request);
		response.setHeader(HttpHeaders.VARY, HttpHeaders.ORIGIN);
		String origin = request.getHeader(HttpHeaders.ORIGIN);
		if (origin == null) {
			chain.doFilter(request, response);
			return;
		}
		// The configured value is echoed, never the request's own header.
		String allowed = this.allowedOrigins.stream().filter(origin::equals).findFirst().orElse(null);
		if (allowed == null) {
			ContactOutcomeLog.write(request, ContactOutcome.ORIGIN_REFUSED);
			this.errorResponseWriter.write(request, response, HttpStatus.FORBIDDEN);
			return;
		}
		response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, allowed);
		if (CorsUtils.isPreFlightRequest(request)) {
			response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "POST");
			response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "content-type");
			response.setHeader(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "1800");
			return;
		}
		chain.doFilter(request, response);
	}

}
