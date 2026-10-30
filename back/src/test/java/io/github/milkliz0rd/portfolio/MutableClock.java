package io.github.milkliz0rd.portfolio;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

/** A UTC clock that the tests move, so that no test waits (PB-07). */
public final class MutableClock extends Clock {

	private volatile Instant instant;

	public MutableClock(Instant instant) {
		this.instant = instant;
	}

	/** Moves the clock by {@code duration}, backwards if it is negative. */
	public void advance(Duration duration) {
		this.instant = this.instant.plus(duration);
	}

	@Override
	public Instant instant() {
		return this.instant;
	}

	@Override
	public ZoneId getZone() {
		return ZoneOffset.UTC;
	}

	@Override
	public Clock withZone(ZoneId zone) {
		throw new UnsupportedOperationException("A test clock stays in UTC");
	}

}
