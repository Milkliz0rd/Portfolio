package io.github.milkliz0rd.portfolio;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PortfolioBackApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

	@Test
	void healthAnswersOnlyTheStatus() throws Exception {
		this.mockMvc.perform(get("/actuator/health"))
			.andExpect(status().isOk())
			.andExpect(content().string("{\"status\":\"UP\"}"));
	}

	@ParameterizedTest
	@ValueSource(strings = { "/actuator", "/actuator/health/liveness", "/actuator/health/readiness",
			"/actuator/info" })
	void otherActuatorAddressesAreNotFound(String path) throws Exception {
		this.mockMvc.perform(get(path)).andExpect(status().isNotFound());
	}

}
