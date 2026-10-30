package io.github.milkliz0rd.portfolio.config;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;

/**
 * The "contact" properties, mapped from environment variables in application.yaml and checked at
 * startup (PB-04): a wrong value stops the back from starting, with a message that names the
 * variable, never its value. Durations take their unit ({@code 3s}, {@code 2h}, {@code 1500ms}); a
 * duration without unit is read in seconds, not in Spring Boot's default milliseconds.
 *
 * @param allowedOrigins exact origins accepted for browser calls ({@code CONTACT_ALLOWED_ORIGINS});
 * empty, no browser origin is accepted
 * @param tokenMinAge minimal delay between the issue of a form token and its use
 * ({@code CONTACT_TOKEN_MIN_AGE}): zero or more
 * @param tokenMaxAge maximal age of a form token ({@code CONTACT_TOKEN_MAX_AGE}): more than 60 seconds
 * beyond the minimal delay, the margin the front takes off (contract, section 6)
 */
@ConfigurationProperties("contact")
public record ContactProperties(List<String> allowedOrigins, @DurationUnit(ChronoUnit.SECONDS) Duration tokenMinAge,
		@DurationUnit(ChronoUnit.SECONDS) Duration tokenMaxAge) {

	/** A serialized origin: scheme http or https, host, optional port; no path, slash or wildcard. */
	private static final Pattern ORIGIN = Pattern.compile("https?://([a-z0-9-]+\\.)*[a-z0-9-]+(:[0-9]{1,5})?");

	/** What the maximal age must exceed the minimal delay by: the front's margin. */
	private static final Duration FRONT_MARGIN = Duration.ofSeconds(60);

	public ContactProperties {
		allowedOrigins = (allowedOrigins != null) ? List.copyOf(allowedOrigins) : List.of();
		for (int i = 0; i < allowedOrigins.size(); i++) {
			if (!ORIGIN.matcher(allowedOrigins.get(i)).matches()) {
				throw new IllegalArgumentException("CONTACT_ALLOWED_ORIGINS: entry " + (i + 1)
						+ " is not an exact origin (scheme http or https, lower-case host, optional port;"
						+ " no path, trailing slash or wildcard)");
			}
		}
		// An empty variable binds to null.
		if (tokenMinAge == null || tokenMinAge.isNegative()) {
			throw new IllegalArgumentException("CONTACT_TOKEN_MIN_AGE must be a duration of zero or more, such as 3s");
		}
		if (tokenMaxAge == null || tokenMaxAge.minus(tokenMinAge).compareTo(FRONT_MARGIN) <= 0) {
			throw new IllegalArgumentException("CONTACT_TOKEN_MAX_AGE must be a duration that exceeds"
					+ " CONTACT_TOKEN_MIN_AGE by more than 60 seconds, such as 2h");
		}
	}

}
