package io.github.milkliz0rd.portfolio.sender.brevo;

import java.net.URI;
import java.net.http.HttpClient;
import java.time.Duration;

import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

/**
 * The HTTP client of the Brevo adapter (PB-01, PB-04): Spring's RestClient on the JDK's HTTP client,
 * no provider kit. One time limit, {@code CONTACT_PROVIDER_TIMEOUT}, bounds the connection and the
 * answer; the base address is {@code CONTACT_BREVO_BASE_URL}. Redirections are not followed, the JDK
 * client's default.
 */
public final class BrevoRestClientFactory {

	private BrevoRestClientFactory() {
	}

	/**
	 * A builder of the client, kept open so that a test binds its simulated server to it (PB-07).
	 * @param baseUrl the base address of Brevo's API
	 * @param timeout the time limit of the connection, and of the answer, counted from the sending
	 */
	public static RestClient.Builder builder(URI baseUrl, Duration timeout) {
		JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient(timeout));
		requestFactory.setReadTimeout(timeout);
		return RestClient.builder().baseUrl(baseUrl).requestFactory(requestFactory);
	}

	static HttpClient httpClient(Duration timeout) {
		return HttpClient.newBuilder().connectTimeout(timeout).build();
	}

}
