package io.github.milkliz0rd.portfolio.service;

/**
 * The closed vocabulary of the issues of E-02 (PB-05), as far as this version goes: those of the
 * limit per address and of the cap come with them (TK-22).
 */
public enum ContactOutcome {

	SENT("sent"), VALIDATION_REFUSED("validation-refused"), UNREADABLE_BODY("unreadable-body"),
	UNSUPPORTED_MEDIA_TYPE("unsupported-media-type"), NOT_ACCEPTABLE("not-acceptable"),
	ORIGIN_REFUSED("origin-refused"), HONEYPOT("honeypot"), TOKEN_MISSING("token-missing"),
	TOKEN_FORGED("token-forged"), TOKEN_TOO_RECENT("token-too-recent"), TOKEN_EXPIRED("token-expired"),
	PROVIDER_FAILURE("provider-failure"), PROVIDER_TIMEOUT("provider-timeout"), INTERNAL_ERROR("internal-error");

	private final String code;

	ContactOutcome(String code) {
		this.code = code;
	}

	/** The issue as the log line writes it. */
	public String code() {
		return this.code;
	}

}
