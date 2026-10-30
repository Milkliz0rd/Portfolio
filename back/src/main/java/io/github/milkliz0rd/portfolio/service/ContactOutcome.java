package io.github.milkliz0rd.portfolio.service;

/**
 * The closed vocabulary of the issues of E-02 (PB-05), as far as this version goes: the issues of
 * the filter chain and of the provider come with them (TK-22, TK-20).
 */
public enum ContactOutcome {

	SENT("sent"), VALIDATION_REFUSED("validation-refused"), UNREADABLE_BODY("unreadable-body"),
	UNSUPPORTED_MEDIA_TYPE("unsupported-media-type"), NOT_ACCEPTABLE("not-acceptable"),
	ORIGIN_REFUSED("origin-refused"), INTERNAL_ERROR("internal-error");

	private final String code;

	ContactOutcome(String code) {
		this.code = code;
	}

	/** The issue as the log line writes it. */
	public String code() {
		return this.code;
	}

}
