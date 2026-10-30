package io.github.milkliz0rd.portfolio.exception;

/**
 * A refusal of the filter chain or a failure of the provider, rendered as the single 503 of E-02
 * (contract, section 4): the response never tells which. The issue is logged by whoever throws it.
 */
public class ContactUnavailableException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ContactUnavailableException() {
		super("The contact message was not handed to the provider");
	}

}
