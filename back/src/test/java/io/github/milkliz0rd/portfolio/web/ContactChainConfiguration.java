package io.github.milkliz0rd.portfolio.web;

import java.time.Instant;

import io.github.milkliz0rd.portfolio.MutableClock;
import io.github.milkliz0rd.portfolio.antispam.FormTokenFilter;
import io.github.milkliz0rd.portfolio.antispam.HoneypotFilter;
import io.github.milkliz0rd.portfolio.service.ContactService;
import io.github.milkliz0rd.portfolio.service.FormTokenService;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

/**
 * The contact service with its real filter chain and the real FormTokenService, for the web slices
 * of E-02 (PB-07), where only the message sender is simulated; each slice draws the token's secret.
 * The clock is one the tests move, so that no test waits.
 */
@TestConfiguration(proxyBeanMethods = false)
@Import({ ContactService.class, FormTokenService.class, HoneypotFilter.class, FormTokenFilter.class })
class ContactChainConfiguration {

	@Bean
	MutableClock clock() {
		return new MutableClock(Instant.parse("2026-11-02T10:00:00Z"));
	}

}
