package io.github.milkliz0rd.portfolio.antispam;

import static io.github.milkliz0rd.portfolio.antispam.IpRateLimitFilterTest.from;
import static io.github.milkliz0rd.portfolio.antispam.IpRateLimitFilterTest.simultaneously;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import io.github.milkliz0rd.portfolio.MutableClock;
import io.github.milkliz0rd.portfolio.config.ContactProperties;
import io.github.milkliz0rd.portfolio.service.ContactOutcome;
import org.junit.jupiter.api.Test;

/**
 * The global cap without Spring (PB-03, PB-07), at 50 per 24 hours: a fixed window opened by the
 * first counted message, places given back, simultaneous calls. The clock is moved, never awaited.
 */
class DailyCapFilterTest {

	private static final FilterVerdict REFUSED = FilterVerdict.refuse(ContactOutcome.DAILY_CAP);

	private final MutableClock clock = new MutableClock(Instant.parse("2026-11-02T10:00:00Z"));

	private final DailyCapFilter filter = new DailyCapFilter(properties(50), this.clock);

	/** For every address, until 24 hours after the first counted message, not after the last one. */
	@Test
	void theFiftyFirstMessageOfTheWindowIsRefusedUntilANewWindow() {
		for (int i = 0; i < 50; i++) {
			assertThat(this.filter.check(from("203.0.113." + i))).isEqualTo(FilterVerdict.PASS);
			this.clock.advance(Duration.ofMinutes(20));
		}
		this.clock.advance(Duration.ofHours(24).minusMinutes(20 * 50).minusMillis(1));
		assertThat(this.filter.check(from("198.51.100.1"))).isEqualTo(REFUSED);
		this.clock.advance(Duration.ofMillis(1));
		assertThat(this.filter.check(from("198.51.100.1"))).isEqualTo(FilterVerdict.PASS);
		assertThat(this.filter.count()).isEqualTo(1);
	}

	/** A place given back serves again; a window back to zero is closed, the next message opening another. */
	@Test
	void aPlaceGivenBackServesAgain() {
		DailyCapFilter one = new DailyCapFilter(properties(1), this.clock);
		one.check(from("203.0.113.10"));
		assertThat(one.check(from("203.0.113.11"))).isEqualTo(REFUSED);
		one.release(from("203.0.113.10"));
		this.clock.advance(Duration.ofHours(1));
		assertThat(one.check(from("203.0.113.11"))).isEqualTo(FilterVerdict.PASS);
		this.clock.advance(Duration.ofHours(23));
		assertThat(one.check(from("203.0.113.12"))).isEqualTo(REFUSED);
		this.clock.advance(Duration.ofHours(1));
		assertThat(one.check(from("203.0.113.12"))).isEqualTo(FilterVerdict.PASS);
	}

	/** Under its single lock: exactly the cap passes, then each release gives one back. */
	@Test
	void simultaneousCallsGiveExactlyTheCap() throws Exception {
		List<FilterVerdict> verdicts = simultaneously(80, () -> this.filter.check(from("203.0.113.10")));
		assertThat(verdicts).filteredOn(FilterVerdict.PASS::equals).hasSize(50);
		assertThat(verdicts).filteredOn(REFUSED::equals).hasSize(30);
		simultaneously(20, () -> {
			this.filter.release(from("203.0.113.10"));
			return null;
		});
		assertThat(this.filter.count()).isEqualTo(30);
	}

	private static ContactProperties properties(int dailyCap) {
		return new ContactProperties(List.of(), Duration.ofSeconds(3), Duration.ofHours(2), Duration.ofSeconds(10),
				"https://api.brevo.com/v3", "", 1, 5, dailyCap);
	}

}
