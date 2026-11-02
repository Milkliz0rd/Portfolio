package io.github.milkliz0rd.portfolio.antispam;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import io.github.milkliz0rd.portfolio.config.ContactProperties;
import io.github.milkliz0rd.portfolio.service.ContactOutcome;

import org.springframework.core.annotation.Order;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * The limit per address (PB-03): {@code CONTACT_IP_LIMIT_PER_HOUR} messages per key of the visitor's
 * address, in a fixed window of one hour opened by its first counted message; the next message of
 * the window is refused. The place is reserved in one atomic step per key when the message passes,
 * and given back when a later filter refuses it; a window back to zero is removed. Every 60 seconds,
 * without any incoming request, the expired windows are removed one by one, atomically: an address
 * stays in memory an hour and a minute at most (CT-12). All of it lives in the memory of the single
 * instance and starts again from zero at each sleep and restart (CT-08). After the token.
 */
@Component
@Order(40)
public class IpRateLimitFilter implements ContactFilter {

	private static final Duration WINDOW = Duration.ofHours(1);

	private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

	private final int limit;

	private final Clock clock;

	public IpRateLimitFilter(ContactProperties properties, Clock clock) {
		this.limit = properties.ipLimitPerHour();
		this.clock = clock;
	}

	@Override
	public FilterVerdict check(ContactSubmission submission) {
		Instant now = this.clock.instant();
		AtomicBoolean reserved = new AtomicBoolean();
		this.windows.compute(submission.clientIpKey(), (key, window) -> {
			if (window == null || window.isExpiredAt(now)) {
				reserved.set(true);
				return new Window(now, 1);
			}
			if (window.count() < this.limit) {
				reserved.set(true);
				return new Window(window.opening(), window.count() + 1);
			}
			return window;
		});
		return reserved.get() ? FilterVerdict.PASS : FilterVerdict.refuse(ContactOutcome.IP_LIMIT);
	}

	@Override
	public void release(ContactSubmission submission) {
		this.windows.computeIfPresent(submission.clientIpKey(),
				(key, window) -> (window.count() > 1) ? new Window(window.opening(), window.count() - 1) : null);
	}

	/** Removes the expired windows, one by one and atomically. */
	@Scheduled(initialDelay = 60, fixedRate = 60, timeUnit = TimeUnit.SECONDS)
	void purge() {
		Instant now = this.clock.instant();
		for (String key : this.windows.keySet()) {
			this.windows.computeIfPresent(key, (same, window) -> window.isExpiredAt(now) ? null : window);
		}
	}

	/** The number of windows in memory, for the tests. */
	int windowCount() {
		return this.windows.size();
	}

	/** A window: its opening and the number of messages counted in it. */
	private record Window(Instant opening, int count) {

		boolean isExpiredAt(Instant now) {
			return !now.isBefore(this.opening.plus(WINDOW));
		}

	}

}
