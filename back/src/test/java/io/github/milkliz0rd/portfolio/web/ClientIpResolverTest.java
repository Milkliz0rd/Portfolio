package io.github.milkliz0rd.portfolio.web;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.mock.web.MockHttpServletRequest;

/** The key of the visitor's address (PB-03, PB-07), with addresses of the documentation ranges only. */
@ExtendWith(OutputCaptureExtension.class)
class ClientIpResolverTest {

	private static final String HEADER = "X-Forwarded-For";

	private static final String CONNECTION = "192.0.2.1";

	private static final String WARNING = "CONTACT_CLIENT_IP_HEADER is set, but a request had no address";

	/** Without header setting, the connection's address, whatever the request's headers; no warning. */
	@Test
	void anEmptySettingTakesTheConnectionsAddress(CapturedOutput output) {
		assertThat(new ClientIpResolver("", 1).resolve(request("203.0.113.10"))).isEqualTo(CONNECTION);
		assertThat(output.getAll()).doesNotContain(WARNING);
	}

	/** Counted from the right: what a visitor writes on the left, before the proxy's element, is ignored. */
	@ParameterizedTest
	@CsvSource(delimiter = '|', value = { "1 | 203.0.113.10 | 203.0.113.10",
			"1 | 198.51.100.99, 203.0.113.10 | 203.0.113.10", "2 | 198.51.100.99, 203.0.113.10, 192.0.2.7 | 203.0.113.10",
			"1 | 198.51.100.99,203.0.113.10 , , | 203.0.113.10", "3 | 203.0.113.10,\t198.51.100.99 , 192.0.2.7 | 203.0.113.10",
			"1 | 203.0.113.010 | 203.0.113.10", "1 | ::ffff:203.0.113.10 | 203.0.113.10" })
	void theElementAtTheRankFromTheRightIsTheKey(int position, String value, String key) {
		assertThat(new ClientIpResolver(HEADER, position).resolve(request(value))).isEqualTo(key);
	}

	/** Several lines of the header make one list, in their order (RFC 9110, section 5.3). */
	@Test
	void severalLinesOfTheHeaderMakeASingleList() {
		MockHttpServletRequest request = request("198.51.100.99, 203.0.113.10");
		request.addHeader(HEADER, "192.0.2.7");
		assertThat(new ClientIpResolver(HEADER, 1).resolve(request)).isEqualTo("192.0.2.7");
		assertThat(new ClientIpResolver(HEADER, 2).resolve(request)).isEqualTo("203.0.113.10");
		assertThat(new ClientIpResolver(HEADER, 3).resolve(request)).isEqualTo("198.51.100.99");
	}

	@Test
	void theHeaderNameIgnoresCase() {
		MockHttpServletRequest request = request(null);
		request.addHeader("x-forwarded-for", "203.0.113.10");
		assertThat(new ClientIpResolver(HEADER, 1).resolve(request)).isEqualTo("203.0.113.10");
	}

	/** An IPv6 address counts by its /64 prefix, whichever form it is written in; the key is not the address. */
	@Test
	void anIpv6AddressComesDownToItsPrefix() {
		ClientIpResolver resolver = new ClientIpResolver(HEADER, 1);
		String key = resolver.resolve(request("2001:db8:1:2::1"));
		assertThat(resolver.resolve(request("2001:DB8:1:2:aaaa:bbbb:cccc:3"))).isEqualTo(key);
		assertThat(resolver.resolve(request("[2001:db8:1:2::ffff]"))).isEqualTo(key);
		assertThat(resolver.resolve(request("2001:db8:1:3::1"))).isNotEqualTo(key);
		assertThat(key).doesNotContain("2001:db8");
		MockHttpServletRequest overIpv6 = request(null);
		overIpv6.setRemoteAddr("2001:db8:1:2:0:0:0:9");
		assertThat(new ClientIpResolver("", 1).resolve(overIpv6)).isEqualTo(key);
	}

	/** Missing header, list too short, no address (a name is never looked up): the connection's address. */
	@ParameterizedTest
	@ValueSource(strings = { "", " , ", "pas-une-ip", "localhost", "203.0.113.10:443", "203.0.113.10 198.51.100.99" })
	void anElementThatIsNotAnAddressFallsBackOnTheConnection(String value) {
		assertThat(new ClientIpResolver(HEADER, 1).resolve(request(value.isEmpty() ? null : value)))
			.isEqualTo(CONNECTION);
		assertThat(new ClientIpResolver(HEADER, 3).resolve(request("198.51.100.99, 203.0.113.10")))
			.isEqualTo(CONNECTION);
	}

	/** Once per startup, that is per resolver, and without any value: neither the header's nor the address. */
	@Test
	void theFallBackIsWarnedOnceWithoutValue(CapturedOutput output) {
		ClientIpResolver resolver = new ClientIpResolver(HEADER, 2);
		resolver.resolve(request(null));
		resolver.resolve(request("pas-une-ip, 203.0.113.10"));
		resolver.resolve(request("203.0.113.10"));
		assertThat(output.getAll().lines().filter((line) -> line.contains(WARNING))).singleElement()
			.asString()
			.contains("WARN")
			.doesNotContain(CONNECTION)
			.doesNotContain("203.0.113")
			.doesNotContain("pas-une-ip")
			.doesNotContain(HEADER);
	}

	/** A request from the connection's address, with the header when {@code value} is not null. */
	private static MockHttpServletRequest request(String value) {
		MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/contact-messages");
		request.setRemoteAddr(CONNECTION);
		if (value != null) {
			request.addHeader(HEADER, value);
		}
		return request;
	}

}
