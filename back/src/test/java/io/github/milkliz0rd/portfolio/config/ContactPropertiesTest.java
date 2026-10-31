package io.github.milkliz0rd.portfolio.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.time.Duration;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

/**
 * Reading of CONTACT_ALLOWED_ORIGINS, CONTACT_TOKEN_MIN_AGE, CONTACT_TOKEN_MAX_AGE, CONTACT_PROVIDER_TIMEOUT and
 * CONTACT_BREVO_BASE_URL at startup (PB-04).
 */
class ContactPropertiesTest {

	private final ApplicationContextRunner runner = new ApplicationContextRunner()
		.withUserConfiguration(PropertiesConfiguration.class)
		.withPropertyValues("contact.token-min-age=3s", "contact.token-max-age=2h", "contact.provider-timeout=10s",
				"contact.brevo-base-url=https://api.brevo.com/v3");

	@ParameterizedTest
	@ValueSource(strings = { "https://*.site.example", "https://site.example/path", "https://site.example/",
			"http://localhost:4200,https://site.example/" })
	void startupIsRefusedForAnOriginThatIsNotExact(String origins) {
		this.runner.withPropertyValues("contact.allowed-origins=" + origins).run((context) -> {
			assertThat(context).hasFailed();
			assertThat(context.getStartupFailure()).rootCause()
				.hasMessageContaining("CONTACT_ALLOWED_ORIGINS")
				.hasMessageNotContaining("site.example");
		});
	}

	@Test
	void severalExactOriginsAreRead() {
		this.runner.withPropertyValues("contact.allowed-origins=http://localhost:4200, https://www.site.example")
			.run((context) -> assertThat(context.getBean(ContactProperties.class).allowedOrigins())
				.containsExactly("http://localhost:4200", "https://www.site.example"));
	}

	@Test
	void anEmptyValueAllowsNoOrigin() {
		this.runner.withPropertyValues("contact.allowed-origins=")
			.run((context) -> assertThat(context.getBean(ContactProperties.class).allowedOrigins()).isEmpty());
	}

	/** Durations with their unit; without unit, in seconds: 45 is 45 s, where Spring Boot would read 45 ms. */
	@ParameterizedTest
	@CsvSource({ "3s, 2h, PT3S, PT2H", "1500ms, 7199999ms, PT1.5S, PT1H59M59.999S", "45, 3600, PT45S, PT1H",
			"0s, 60001ms, PT0S, PT1M0.001S", "3s, 63001ms, PT3S, PT1M3.001S" })
	void theTokenDurationsAreRead(String minAge, String maxAge, Duration min, Duration max) {
		this.runner.withPropertyValues("contact.token-min-age=" + minAge, "contact.token-max-age=" + maxAge)
			.run((context) -> {
				assertThat(context.getBean(ContactProperties.class).tokenMinAge()).isEqualTo(min);
				assertThat(context.getBean(ContactProperties.class).tokenMaxAge()).isEqualTo(max);
			});
	}

	/** A negative or empty minimal delay; a maximal age empty, or not more than 60 s beyond the delay. */
	@ParameterizedTest
	@CsvSource({ "-1ms, 2h, CONTACT_TOKEN_MIN_AGE", "'', 2h, CONTACT_TOKEN_MIN_AGE", "3s, '', CONTACT_TOKEN_MAX_AGE",
			"3s, 63s, CONTACT_TOKEN_MAX_AGE", "10m, 10m, CONTACT_TOKEN_MAX_AGE", "0s, 60s, CONTACT_TOKEN_MAX_AGE" })
	void wrongTokenDurationsStopTheStartup(String minAge, String maxAge, String variable) {
		this.runner.withPropertyValues("contact.token-min-age=" + minAge, "contact.token-max-age=" + maxAge)
			.run((context) -> {
				assertThat(context).hasFailed();
				assertThat(context.getStartupFailure()).rootCause().hasMessageStartingWith(variable + " must be");
			});
	}

	/** The values of application.yaml when the variables are unset; skipped if this shell sets them. */
	@Test
	void theTokenDurationsDefaultTo3sAnd2h() {
		assumeTrue(System.getenv("CONTACT_TOKEN_MIN_AGE") == null && System.getenv("CONTACT_TOKEN_MAX_AGE") == null,
				"CONTACT_TOKEN_MIN_AGE or CONTACT_TOKEN_MAX_AGE is set in this shell");
		new ApplicationContextRunner().withUserConfiguration(PropertiesConfiguration.class)
			.withInitializer(new ConfigDataApplicationContextInitializer())
			.run((context) -> {
				assertThat(context.getBean(ContactProperties.class).tokenMinAge()).isEqualTo(Duration.ofSeconds(3));
				assertThat(context.getBean(ContactProperties.class).tokenMaxAge()).isEqualTo(Duration.ofHours(2));
			});
	}

	/** From 1 to 20 seconds, bounds included; without unit, in seconds. */
	@ParameterizedTest
	@CsvSource({ "10s, PT10S", "1s, PT1S", "20s, PT20S", "1500ms, PT1.5S", "5, PT5S" })
	void theProviderTimeoutIsRead(String timeout, Duration expected) {
		this.runner.withPropertyValues("contact.provider-timeout=" + timeout)
			.run((context) -> assertThat(context.getBean(ContactProperties.class).providerTimeout()).isEqualTo(expected));
	}

	@ParameterizedTest
	@ValueSource(strings = { "0s", "999ms", "20001ms", "25s", "-1s", "" })
	void aProviderTimeoutOutside1To20SecondsStopsTheStartup(String timeout) {
		this.runner.withPropertyValues("contact.provider-timeout=" + timeout).run((context) -> {
			assertThat(context).hasFailed();
			assertThat(context.getStartupFailure()).rootCause()
				.hasMessageStartingWith("CONTACT_PROVIDER_TIMEOUT must be a duration from 1 to 20 seconds");
		});
	}

	@ParameterizedTest
	@ValueSource(strings = { "https://api.brevo.com/v3", "https://localhost:18386/v3", "https://brevo.example" })
	void anAbsoluteHttpsBaseAddressIsRead(String address) {
		this.runner.withPropertyValues("contact.brevo-base-url=" + address)
			.run((context) -> assertThat(context.getBean(ContactProperties.class).brevoBaseUrl()).isEqualTo(address));
	}

	/** Another scheme, an upper-case one, a relative address, no host, a user, a query, a fragment, a space. */
	@ParameterizedTest
	@ValueSource(strings = { "http://marqueur.example/v3", "HTTPS://marqueur.example/v3", "//marqueur.example/v3",
			"/v3", "marqueur.example/v3", "https://", "https:///v3", "https://marqueur" + "@" + "brevo.example/v3",
			"https://brevo.example/v3?marqueur=1", "https://brevo.example/v3#marqueur", "https://marqueur example/v3",
			"" })
	void aBaseAddressThatIsNotAbsoluteHttpsStopsTheStartupWithoutBeingShown(String address) {
		this.runner.withPropertyValues("contact.brevo-base-url=" + address).run((context) -> {
			assertThat(context).hasFailed();
			assertThat(context.getStartupFailure()).rootCause()
				.hasMessageStartingWith("CONTACT_BREVO_BASE_URL must be an absolute https address")
				.hasMessageNotContaining("marqueur")
				.hasMessageNotContaining("example");
		});
	}

	/** The values of application.yaml when the variables are unset; skipped if this shell sets them. */
	@Test
	void theProviderSettingsDefaultTo10sAndBrevosPublicAddress() {
		assumeTrue(System.getenv("CONTACT_PROVIDER_TIMEOUT") == null && System.getenv("CONTACT_BREVO_BASE_URL") == null,
				"CONTACT_PROVIDER_TIMEOUT or CONTACT_BREVO_BASE_URL is set in this shell");
		new ApplicationContextRunner().withUserConfiguration(PropertiesConfiguration.class)
			.withInitializer(new ConfigDataApplicationContextInitializer())
			.run((context) -> {
				assertThat(context.getBean(ContactProperties.class).providerTimeout()).isEqualTo(Duration.ofSeconds(10));
				assertThat(context.getBean(ContactProperties.class).brevoBaseUrl()).isEqualTo("https://api.brevo.com/v3");
			});
	}

	@EnableConfigurationProperties(ContactProperties.class)
	static class PropertiesConfiguration {

	}

}
