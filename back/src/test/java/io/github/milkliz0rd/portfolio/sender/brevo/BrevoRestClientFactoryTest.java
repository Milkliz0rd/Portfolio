package io.github.milkliz0rd.portfolio.sender.brevo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import java.io.IOException;
import java.net.http.HttpTimeoutException;
import java.time.Duration;
import java.util.Map;

import org.junit.jupiter.api.Test;

import org.springframework.http.MediaType;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

/** The client of the Brevo adapter, against the JDK's HTTP server: base address and time limits (PB-04, PB-07). */
class BrevoRestClientFactoryTest {

	@Test
	void theConnectionTimeLimitIsTheProviderTimeout() {
		assertThat(BrevoRestClientFactory.httpClient(Duration.ofSeconds(7)).connectTimeout())
			.contains(Duration.ofSeconds(7));
	}

	@Test
	void aPathIsCalledUnderTheBaseAddress() throws IOException {
		try (LocalHttpServer server = new LocalHttpServer(201, Duration.ZERO)) {
			RestClient client = BrevoRestClientFactory.builder(server.baseUrl(), Duration.ofSeconds(5)).build();
			assertThat(client.post().uri("/smtp/email").retrieve().toBodilessEntity().getStatusCode().value())
				.isEqualTo(201);
			assertThat(server.paths()).containsExactly("/v3/smtp/email");
		}
	}

	/** Gathered, the body goes with its length, not in chunks. */
	@Test
	void theBodyIsSentWithItsLength() throws IOException {
		try (LocalHttpServer server = new LocalHttpServer(201, Duration.ZERO)) {
			BrevoRestClientFactory.builder(server.baseUrl(), Duration.ofSeconds(5))
				.build()
				.post()
				.uri("/smtp/email")
				.contentType(MediaType.APPLICATION_JSON)
				.body(Map.of("subject", "Sujet"))
				.retrieve()
				.toBodilessEntity();
			assertThat(server.framings()).containsExactly("Content-Length 19, Transfer-Encoding null, 19 bytes");
		}
	}

	/** A server that answers after 2 seconds, a client set on 1 second: the real client gives up in time. */
	@Test
	void theAnswerTimeLimitIsAppliedByTheRealClient() throws IOException {
		try (LocalHttpServer server = new LocalHttpServer(201, Duration.ofSeconds(2))) {
			RestClient client = BrevoRestClientFactory.builder(server.baseUrl(), Duration.ofSeconds(1)).build();
			long start = System.nanoTime();
			assertThatExceptionOfType(ResourceAccessException.class)
				.isThrownBy(() -> client.post().uri("/smtp/email").retrieve().toBodilessEntity())
				.withRootCauseInstanceOf(HttpTimeoutException.class);
			assertThat(Duration.ofNanos(System.nanoTime() - start)).isBetween(Duration.ofMillis(900),
					Duration.ofMillis(1999));
		}
	}

}
