package io.github.milkliz0rd.portfolio;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Locale;
import java.util.UUID;

import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.brevo.BrevoMessageSender;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

/**
 * The whole application, with the default sender, brevo, which these tests never call: a visibly
 * fake key and example addresses, and a token secret drawn by the test, without which the back does
 * not start.
 */
@SpringBootTest(properties = "contact.mail-sender=brevo")
@AutoConfigureMockMvc
class PortfolioBackApplicationTests {

	private static final String TOKEN_SECRET = TestSecrets.draw(32);

	@DynamicPropertySource
	static void secretsAndAddresses(DynamicPropertyRegistry registry) {
		registry.add("contact.token-secret", () -> TOKEN_SECRET);
		registry.add("contact.brevo-api-key", () -> "cle-factice-" + UUID.randomUUID());
		registry.add("contact.mail-from", () -> "expedition" + "@" + "exemple.fr");
		registry.add("contact.mail-to", () -> "destination" + "@" + "exemple.fr");
	}

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private MessageSender messageSender;

	@Test
	void contextLoads() {
		assertThat(this.messageSender).isInstanceOf(BrevoMessageSender.class);
	}

	@Test
	void healthAnswersOnlyTheStatus() throws Exception {
		this.mockMvc.perform(get("/actuator/health"))
			.andExpect(status().isOk())
			.andExpect(content().string("{\"status\":\"UP\"}"))
			.andExpect(header().string(HttpHeaders.CACHE_CONTROL, "no-store"))
			.andExpect(header().string("X-Content-Type-Options", "nosniff"))
			.andExpect(header().string("Content-Security-Policy", "frame-ancestors 'none'"))
			// Not meant for a browser: no CORS header at all, neither Access-Control-* nor Vary.
			.andExpect((result) -> assertThat(result.getResponse().getHeaderNames()).noneMatch(
					(name) -> name.toLowerCase(Locale.ROOT).startsWith("access-control-") || "vary".equalsIgnoreCase(name)));
	}

	@ParameterizedTest
	@ValueSource(strings = { "/actuator", "/actuator/health/liveness", "/actuator/health/readiness",
			"/actuator/info" })
	void otherActuatorAddressesAreNotFound(String path) throws Exception {
		this.mockMvc.perform(get(path)).andExpect(status().isNotFound());
	}

}
