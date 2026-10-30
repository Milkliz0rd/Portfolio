package io.github.milkliz0rd.portfolio.sender;

import java.util.Objects;

/**
 * The five fields of a validated message, without their edge spaces: all a sender receives, neither
 * the honeypot nor the token. Its text never shows a value.
 */
public record ContactMessage(String lastName, String firstName, String email, String subject, String message) {

	public ContactMessage {
		Objects.requireNonNull(lastName, "lastName");
		Objects.requireNonNull(firstName, "firstName");
		Objects.requireNonNull(email, "email");
		Objects.requireNonNull(subject, "subject");
		Objects.requireNonNull(message, "message");
	}

	@Override
	public String toString() {
		return "ContactMessage[values hidden]";
	}

}
