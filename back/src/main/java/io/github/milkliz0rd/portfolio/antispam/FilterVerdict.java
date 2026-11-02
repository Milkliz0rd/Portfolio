package io.github.milkliz0rd.portfolio.antispam;

import io.github.milkliz0rd.portfolio.service.ContactOutcome;
import org.jspecify.annotations.Nullable;

/**
 * The verdict of a filter (PB-01): pass the message to the next filter; take it silently, which
 * answers as a sending does and sends nothing (CT-08); or refuse it, which answers the single 503 of
 * E-02. The last two name the issue of the log line (PB-05).
 */
public record FilterVerdict(Decision decision, @Nullable ContactOutcome outcome) {

	/** The message goes on to the next filter. */
	public static final FilterVerdict PASS = new FilterVerdict(Decision.PASS, null);

	/** What becomes of the message. */
	public enum Decision {

		PASS, TAKE, REFUSE

	}

	/** An issue for a message taken or refused, and none for one that passes. */
	public FilterVerdict {
		if ((decision == Decision.PASS) != (outcome == null)) {
			throw new IllegalArgumentException("A verdict names an issue if and only if it stops the message");
		}
	}

	public static FilterVerdict take(ContactOutcome outcome) {
		return new FilterVerdict(Decision.TAKE, outcome);
	}

	public static FilterVerdict refuse(ContactOutcome outcome) {
		return new FilterVerdict(Decision.REFUSE, outcome);
	}

}
