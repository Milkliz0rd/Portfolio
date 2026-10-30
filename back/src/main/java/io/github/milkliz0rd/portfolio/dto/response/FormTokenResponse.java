package io.github.milkliz0rd.portfolio.dto.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

/**
 * The body of the 200 of E-01: the opaque form token, then the minimal delay and the maximal age in
 * force, in whole seconds counted from its issue. Its text never shows the token.
 */
@JsonPropertyOrder({ "formToken", "minDelaySeconds", "expiresInSeconds" })
public record FormTokenResponse(String formToken, long minDelaySeconds, long expiresInSeconds) {

	@Override
	public String toString() {
		return "FormTokenResponse[formToken hidden, minDelaySeconds=" + this.minDelaySeconds + ", expiresInSeconds="
				+ this.expiresInSeconds + "]";
	}

}
