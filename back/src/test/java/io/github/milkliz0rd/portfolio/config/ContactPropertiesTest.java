package io.github.milkliz0rd.portfolio.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

/** Reading of CONTACT_ALLOWED_ORIGINS at startup (PB-04). */
class ContactPropertiesTest {

	private final ApplicationContextRunner runner = new ApplicationContextRunner()
		.withUserConfiguration(PropertiesConfiguration.class);

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

	@EnableConfigurationProperties(ContactProperties.class)
	static class PropertiesConfiguration {

	}

}
