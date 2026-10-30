package io.github.milkliz0rd.portfolio.sender;

import org.jspecify.annotations.Nullable;

/**
 * The provider did not accept a message: a failure, or its time limit exceeded. Its text names the
 * kind only, never a value of the message nor a response of the provider.
 */
public class SendFailedException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	/** Why the provider did not accept the message. */
	public enum Kind {

		/** An answer outside 2xx, or a network error. */
		FAILURE,

		/** No answer within the time limit. */
		TIMEOUT

	}

	private final Kind kind;

	public SendFailedException(Kind kind, @Nullable Throwable cause) {
		super("The provider did not accept the message: " + kind, cause);
		this.kind = kind;
	}

	public Kind kind() {
		return this.kind;
	}

}
