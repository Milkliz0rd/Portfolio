package io.github.milkliz0rd.portfolio.antispam;

/**
 * A filter of the chain against unwanted messages (CT-08, D-06), which ContactService runs after the
 * validation, in the order of the components: honeypot, token, limit per address, cap (PB-06). A
 * layer is added as one more component of this package, ordered after the token and before the
 * limit per address, without touching the rest (PB-01).
 */
public interface ContactFilter {

	/** The verdict on a message; a filter that counts reserves its place when it lets the message pass. */
	FilterVerdict check(ContactSubmission submission);

	/** Gives back the place {@link #check} reserved, when a later filter refuses the message; none by default. */
	default void release(ContactSubmission submission) {
	}

}
