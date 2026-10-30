package io.github.milkliz0rd.portfolio.sender;

import org.jspecify.annotations.Nullable;

/**
 * The provider did not accept a message: a failure, or its time limit exceeded. It carries the
 * provider's response code when the provider answered, and nothing else: no cause, whose text could
 * quote a response of the provider. Its text names the kind and that code only, never a value of the
 * message.
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

	private final @Nullable Integer providerStatus;

	/**
	 * @param kind why the provider did not accept the message
	 * @param providerStatus the HTTP code of the provider's answer; null when it did not answer
	 */
	public SendFailedException(Kind kind, @Nullable Integer providerStatus) {
		super("The provider did not accept the message: " + kind
				+ ((providerStatus != null) ? ", status " + providerStatus : ""));
		this.kind = kind;
		this.providerStatus = providerStatus;
	}

	public Kind kind() {
		return this.kind;
	}

	/** The HTTP code of the provider's answer; null after a network error or a timeout. */
	public @Nullable Integer providerStatus() {
		return this.providerStatus;
	}

}
