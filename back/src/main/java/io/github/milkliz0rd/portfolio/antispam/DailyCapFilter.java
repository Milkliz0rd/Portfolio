package io.github.milkliz0rd.portfolio.antispam;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

import io.github.milkliz0rd.portfolio.config.ContactProperties;
import io.github.milkliz0rd.portfolio.service.ContactOutcome;
import org.jspecify.annotations.Nullable;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * The global cap (PB-03): {@code CONTACT_DAILY_CAP} messages in a fixed window of 24 hours, opened
 * by its first counted message; the next message of the window is refused. A single lock guards the
 * window: the place is reserved when the message passes, and given back when a later filter refuses
 * it; a window back to zero is closed. In memory only, so a cap per waking period (CT-08). Last
 * filter, after the limit per address.
 */
@Component
@Order(50)
public class DailyCapFilter implements ContactFilter {

	private static final Duration WINDOW = Duration.ofHours(24);

	private final int cap;

	private final Clock clock;

	private @Nullable Instant opening;

	private int count;

	public DailyCapFilter(ContactProperties properties, Clock clock) {
		this.cap = properties.dailyCap();
		this.clock = clock;
	}

	@Override
	public synchronized FilterVerdict check(ContactSubmission submission) {
		Instant now = this.clock.instant();
		if (this.opening == null || !now.isBefore(this.opening.plus(WINDOW))) {
			this.opening = now;
			this.count = 1;
			return FilterVerdict.PASS;
		}
		if (this.count >= this.cap) {
			return FilterVerdict.refuse(ContactOutcome.DAILY_CAP);
		}
		this.count++;
		return FilterVerdict.PASS;
	}

	@Override
	public synchronized void release(ContactSubmission submission) {
		if (this.count > 1) {
			this.count--;
		}
		else {
			this.count = 0;
			this.opening = null;
		}
	}

	/** The number of messages counted in the window, for the tests. */
	synchronized int count() {
		return this.count;
	}

}
