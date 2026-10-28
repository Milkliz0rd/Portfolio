package io.github.milkliz0rd.portfolio.web;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.server.PathContainer;
import org.springframework.web.util.ServletRequestPathUtils;

/**
 * The perimeter of the form routes, one rule for every filter that guards them. It reads the path
 * that Spring MVC matches, parsed from the request URI as the dispatcher servlet parses it, each
 * segment decoded and without its path parameters: on the raw URI, {@code /api;x=1/v1/} or
 * {@code /api/v%31/} would reach a controller under {@code /api/v1/} around the filters.
 */
final class ApiRoutes {

	/** Prefix of the form routes, the only ones that answer browser calls. */
	static final String PREFIX = "/api/v1/";

	private ApiRoutes() {
	}

	/** Whether the path Spring MVC matches for this request is under {@link #PREFIX}. */
	static boolean contains(HttpServletRequest request) {
		StringBuilder path = new StringBuilder();
		for (PathContainer.Element element : ServletRequestPathUtils.parse(request).pathWithinApplication().elements()) {
			path.append((element instanceof PathContainer.PathSegment segment) ? segment.valueToMatch() : element.value());
		}
		return path.toString().startsWith(PREFIX);
	}

}
