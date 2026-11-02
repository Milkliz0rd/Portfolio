package io.github.milkliz0rd.portfolio.antispam;

import java.util.Objects;

import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import org.jspecify.annotations.Nullable;

/**
 * What the filter chain judges (PB-01): the validated message, the honeypot without its edge spaces,
 * the token as received and the key of the visitor's address (PB-03). Its text shows none of them.
 */
public record ContactSubmission(ContactMessage message, @Nullable String website, @Nullable String formToken,
		String clientIpKey) {

	public ContactSubmission {
		Objects.requireNonNull(message, "message");
		Objects.requireNonNull(clientIpKey, "clientIpKey");
	}

	@Override
	public String toString() {
		return "ContactSubmission[values hidden]";
	}

}
