package io.github.milkliz0rd.portfolio.service;

import java.util.Map;
import java.util.stream.Collectors;

import io.github.milkliz0rd.portfolio.controller.ContactMessageController;
import jakarta.servlet.http.HttpServletRequest;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpMethod;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.ServletRequestPathUtils;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;

/**
 * The single log line of each POST on the route of E-02 (PB-05), under the logger {@code contact}:
 * {@code contact-message outcome=<issue> durationMs=<duration>}, plus
 * {@code fields=<field>:<reason>,…} for a validation refusal. It names the issue and never a value
 * of the request: neither a field, nor an address, nor a header, nor an excerpt of the body.
 * AllowedOriginFilter marks such a request on its arrival; only a marked request gets a line, and
 * only one, from whoever writes first: a preflight request, E-01 and E-03 never get one. Static,
 * not a bean, so that the servlet filters and the error handler that write it load in slice tests.
 */
public final class ContactOutcomeLog {

	/** The request attribute that marks a POST on E-02, with its arrival from {@link System#nanoTime()}. */
	public static final String ARRIVAL = ContactOutcomeLog.class.getName() + ".arrival";

	private static final Logger LOGGER = LoggerFactory.getLogger("contact");

	private static final PathPattern ROUTE = PathPatternParser.defaultInstance.parse(ContactMessageController.ROUTE);

	private ContactOutcomeLog() {
	}

	/** Marks a POST on the route of E-02 as Spring MVC matches it: decoded, without path parameters. */
	public static void markArrival(HttpServletRequest request) {
		if (HttpMethod.POST.matches(request.getMethod())
				&& ROUTE.matches(ServletRequestPathUtils.parse(request).pathWithinApplication())) {
			request.setAttribute(ARRIVAL, System.nanoTime());
		}
	}

	/** The line of the current request, for a service, which has no request at hand. */
	public static void write(ContactOutcome outcome) {
		if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attributes) {
			write(attributes.getRequest(), outcome);
		}
	}

	public static void write(HttpServletRequest request, ContactOutcome outcome) {
		write(request, outcome, "", null);
	}

	/** The validation refusal, with the reason of each field in question, in the order given. */
	public static void writeValidationRefused(HttpServletRequest request, Map<String, String> reasons) {
		String fields = reasons.entrySet()
			.stream()
			.map((reason) -> reason.getKey() + ":" + reason.getValue())
			.collect(Collectors.joining(","));
		write(request, ContactOutcome.VALIDATION_REFUSED, " fields=" + fields, null);
	}

	/** The internal error, at ERROR with its stack trace, which Alexandre must notice. */
	public static void writeInternalError(HttpServletRequest request, @Nullable Throwable failure) {
		write(request, ContactOutcome.INTERNAL_ERROR, "", failure);
	}

	private static void write(HttpServletRequest request, ContactOutcome outcome, String details,
			@Nullable Throwable failure) {
		if (!(request.getAttribute(ARRIVAL) instanceof Long arrival)) {
			return;
		}
		request.removeAttribute(ARRIVAL);
		long durationMs = (System.nanoTime() - arrival) / 1_000_000;
		if (outcome == ContactOutcome.INTERNAL_ERROR) {
			LOGGER.error("contact-message outcome={} durationMs={}{}", outcome.code(), durationMs, details, failure);
		}
		else {
			LOGGER.info("contact-message outcome={} durationMs={}{}", outcome.code(), durationMs, details);
		}
	}

}
