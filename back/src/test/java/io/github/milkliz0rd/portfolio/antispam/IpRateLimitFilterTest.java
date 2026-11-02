package io.github.milkliz0rd.portfolio.antispam;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import io.github.milkliz0rd.portfolio.MutableClock;
import io.github.milkliz0rd.portfolio.config.ContactProperties;
import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.service.ContactOutcome;
import org.junit.jupiter.api.Test;

/**
 * The limit per address without Spring (PB-03, PB-07), at 5 per hour: fixed windows opened by the
 * first counted message, places given back, the purge, and 50 simultaneous calls on one address. The
 * clock is moved, never awaited.
 */
class IpRateLimitFilterTest {

	private static final FilterVerdict REFUSED = FilterVerdict.refuse(ContactOutcome.IP_LIMIT);

	private final MutableClock clock = new MutableClock(Instant.parse("2026-11-02T10:00:00Z"));

	private final IpRateLimitFilter filter = new IpRateLimitFilter(properties(5), this.clock);

	@Test
	void theSixthMessageOfTheHourIsRefusedForThisAddressOnly() {
		for (int i = 0; i < 5; i++) {
			assertThat(this.filter.check(from("203.0.113.10"))).isEqualTo(FilterVerdict.PASS);
		}
		assertThat(this.filter.check(from("203.0.113.10"))).isEqualTo(REFUSED);
		assertThat(this.filter.check(from("198.51.100.20"))).isEqualTo(FilterVerdict.PASS);
	}

	/** Fixed: opened by the first counted message, it ends an hour later, not an hour after the last. */
	@Test
	void aNewWindowOpensAnHourAfterTheFirstCountedMessage() {
		this.filter.check(from("203.0.113.10"));
		this.clock.advance(Duration.ofMinutes(30));
		for (int i = 0; i < 4; i++) {
			this.filter.check(from("203.0.113.10"));
		}
		this.clock.advance(Duration.ofMinutes(30).minusMillis(1));
		assertThat(this.filter.check(from("203.0.113.10"))).isEqualTo(REFUSED);
		this.clock.advance(Duration.ofMillis(1));
		for (int i = 0; i < 5; i++) {
			assertThat(this.filter.check(from("203.0.113.10"))).isEqualTo(FilterVerdict.PASS);
		}
		assertThat(this.filter.check(from("203.0.113.10"))).isEqualTo(REFUSED);
	}

	/** A place given back serves again; a window back to zero is removed, with the address it keeps. */
	@Test
	void aPlaceGivenBackServesAgain() {
		for (int i = 0; i < 5; i++) {
			this.filter.check(from("203.0.113.10"));
		}
		this.filter.release(from("203.0.113.10"));
		assertThat(this.filter.check(from("203.0.113.10"))).isEqualTo(FilterVerdict.PASS);
		assertThat(this.filter.check(from("203.0.113.10"))).isEqualTo(REFUSED);
		this.filter.check(from("198.51.100.20"));
		this.filter.release(from("198.51.100.20"));
		this.filter.release(from("192.0.2.30"));
		assertThat(this.filter.windowCount()).isEqualTo(1);
	}

	@Test
	void thePurgeRemovesTheExpiredWindowsOnly() {
		this.filter.check(from("203.0.113.10"));
		this.clock.advance(Duration.ofMinutes(30));
		this.filter.check(from("198.51.100.20"));
		this.filter.purge();
		assertThat(this.filter.windowCount()).isEqualTo(2);
		this.clock.advance(Duration.ofMinutes(30));
		this.filter.purge();
		assertThat(this.filter.windowCount()).isEqualTo(1);
		this.clock.advance(Duration.ofMinutes(30));
		this.filter.purge();
		assertThat(this.filter.windowCount()).isZero();
	}

	/** Reserved in one atomic step per address: exactly the limit passes; each release gives one back. */
	@Test
	void fiftySimultaneousCallsOnOneAddressGiveExactlyFivePlaces() throws Exception {
		List<FilterVerdict> verdicts = simultaneously(50, () -> this.filter.check(from("203.0.113.10")));
		assertThat(verdicts).filteredOn(FilterVerdict.PASS::equals).hasSize(5);
		assertThat(verdicts).filteredOn(REFUSED::equals).hasSize(45);
		simultaneously(5, () -> {
			this.filter.release(from("203.0.113.10"));
			return null;
		});
		assertThat(this.filter.windowCount()).isZero();
	}

	/** {@code calls} runs of the task on as many threads, all started at once once they are ready. */
	static <T> List<T> simultaneously(int calls, Callable<T> task) throws Exception {
		CountDownLatch ready = new CountDownLatch(calls);
		CountDownLatch start = new CountDownLatch(1);
		try (ExecutorService threads = Executors.newFixedThreadPool(calls)) {
			List<Future<T>> futures = new ArrayList<>();
			for (int i = 0; i < calls; i++) {
				futures.add(threads.submit(() -> {
					ready.countDown();
					start.await();
					return task.call();
				}));
			}
			ready.await();
			start.countDown();
			List<T> results = new ArrayList<>();
			for (Future<T> future : futures) {
				results.add(future.get());
			}
			return results;
		}
	}

	static ContactProperties properties(int ipLimitPerHour) {
		return new ContactProperties(List.of(), Duration.ofSeconds(3), Duration.ofHours(2), Duration.ofSeconds(10),
				"https://api.brevo.com/v3", "", 1, ipLimitPerHour);
	}

	static ContactSubmission from(String clientIpKey) {
		return new ContactSubmission(new ContactMessage("Nom", "Prénom", "visiteur" + "@" + "exemple.fr", "Sujet",
				"Bonjour"), "", "jeton", clientIpKey);
	}

}
