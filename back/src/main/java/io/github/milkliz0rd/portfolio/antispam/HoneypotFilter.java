package io.github.milkliz0rd.portfolio.antispam;

import io.github.milkliz0rd.portfolio.service.ContactOutcome;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * The honeypot, a field no human fills (contract, section 3): any value, its edge spaces removed,
 * takes the message silently, answered as a sending is, and nothing leaves (CT-08). First filter.
 */
@Component
@Order(10)
public class HoneypotFilter implements ContactFilter {

	@Override
	public FilterVerdict check(ContactSubmission submission) {
		String website = submission.website();
		return (website == null || website.isEmpty()) ? FilterVerdict.PASS : FilterVerdict.take(ContactOutcome.HONEYPOT);
	}

}
