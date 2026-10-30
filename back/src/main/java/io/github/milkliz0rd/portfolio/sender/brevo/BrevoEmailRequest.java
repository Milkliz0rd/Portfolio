package io.github.milkliz0rd.portfolio.sender.brevo;

import java.util.List;

import io.github.milkliz0rd.portfolio.sender.ContactMessage;

/**
 * The JSON body of a call to Brevo's transactional e-mail API (Étape 7): the sender, a single
 * recipient, the reply-to address, the subject and a plain-text body; no HTML, no copy. Its text,
 * like that of its parts, never shows a value: Spring's client writes the body it sends at DEBUG.
 *
 * @param sender the sending address, {@code CONTACT_MAIL_FROM}, with a fixed name
 * @param to the receiving address alone, {@code CONTACT_MAIL_TO}
 * @param replyTo the visitor's address, with the first name followed by the last name
 * @param subject the fixed prefix followed by the visitor's subject
 * @param textContent the five fields in plain text
 */
public record BrevoEmailRequest(Mailbox sender, List<Recipient> to, Mailbox replyTo, String subject,
		String textContent) {

	/** The sender's name, fixed (PB-04). */
	static final String SENDER_NAME = "Formulaire du portfolio";

	/** The prefix of the subject, fixed (PB-04). */
	static final String SUBJECT_PREFIX = "[Portfolio] ";

	public BrevoEmailRequest {
		to = List.copyOf(to);
	}

	/** The e-mail of a message: the visitor's address is its reply-to address and nothing else (CT-07). */
	static BrevoEmailRequest of(ContactMessage message, String mailFrom, String mailTo) {
		return new BrevoEmailRequest(new Mailbox(mailFrom, SENDER_NAME), List.of(new Recipient(mailTo)),
				new Mailbox(message.email(), message.firstName() + " " + message.lastName()),
				SUBJECT_PREFIX + message.subject(), text(message));
	}

	/** The five fields, each on its line after its label, in the order of the form; then the message. */
	private static String text(ContactMessage message) {
		return "Nom : " + message.lastName() + "\nPrénom : " + message.firstName() + "\nAdresse e-mail : "
				+ message.email() + "\nSujet : " + message.subject() + "\n\nMessage :\n" + message.message();
	}

	@Override
	public String toString() {
		return "BrevoEmailRequest[values hidden]";
	}

	/** An address and its display name. */
	public record Mailbox(String email, String name) {

		@Override
		public String toString() {
			return "Mailbox[values hidden]";
		}

	}

	/** A recipient's address, without name. */
	public record Recipient(String email) {

		@Override
		public String toString() {
			return "Recipient[value hidden]";
		}

	}

}
