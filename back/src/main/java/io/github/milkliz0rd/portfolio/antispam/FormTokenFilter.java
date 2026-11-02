package io.github.milkliz0rd.portfolio.antispam;

import io.github.milkliz0rd.portfolio.service.ContactOutcome;
import io.github.milkliz0rd.portfolio.service.FormTokenService;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * The form token (PB-02): missing, forged, too recent or expired, the message is refused with the
 * single 503, never a 400 (contract, section 3). After the honeypot.
 */
@Component
@Order(20)
public class FormTokenFilter implements ContactFilter {

	private final FormTokenService formTokenService;

	public FormTokenFilter(FormTokenService formTokenService) {
		this.formTokenService = formTokenService;
	}

	@Override
	public FilterVerdict check(ContactSubmission submission) {
		return switch (this.formTokenService.verify(submission.formToken())) {
			case VALID -> FilterVerdict.PASS;
			case MISSING -> FilterVerdict.refuse(ContactOutcome.TOKEN_MISSING);
			case FORGED -> FilterVerdict.refuse(ContactOutcome.TOKEN_FORGED);
			case TOO_RECENT -> FilterVerdict.refuse(ContactOutcome.TOKEN_TOO_RECENT);
			case EXPIRED -> FilterVerdict.refuse(ContactOutcome.TOKEN_EXPIRED);
		};
	}

}
