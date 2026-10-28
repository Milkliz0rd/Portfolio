package io.github.milkliz0rd.portfolio.config;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * The "contact" properties, mapped from environment variables in application.yaml and checked at
 * startup (PB-04): a wrong value stops the back from starting, with a message that names the
 * variable, never its value.
 *
 * @param allowedOrigins exact origins accepted for browser calls ({@code CONTACT_ALLOWED_ORIGINS});
 * empty, no browser origin is accepted
 */
@ConfigurationProperties("contact")
public record ContactProperties(List<String> allowedOrigins) {

	/** A serialized origin: scheme http or https, host, optional port; no path, slash or wildcard. */
	private static final Pattern ORIGIN = Pattern.compile("https?://([a-z0-9-]+\\.)*[a-z0-9-]+(:[0-9]{1,5})?");

	public ContactProperties {
		allowedOrigins = (allowedOrigins != null) ? List.copyOf(allowedOrigins) : List.of();
		for (int i = 0; i < allowedOrigins.size(); i++) {
			if (!ORIGIN.matcher(allowedOrigins.get(i)).matches()) {
				throw new IllegalArgumentException("CONTACT_ALLOWED_ORIGINS: entry " + (i + 1)
						+ " is not an exact origin (scheme http or https, lower-case host, optional port;"
						+ " no path, trailing slash or wildcard)");
			}
		}
	}

}
