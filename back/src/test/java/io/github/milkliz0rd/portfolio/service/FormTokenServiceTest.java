package io.github.milkliz0rd.portfolio.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalStateException;
import static org.junit.jupiter.params.provider.Arguments.arguments;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.List;
import java.util.stream.Stream;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import io.github.milkliz0rd.portfolio.TestSecrets;
import io.github.milkliz0rd.portfolio.config.ContactProperties;
import org.jspecify.annotations.Nullable;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;

/**
 * The form token without Spring (PB-02, PB-07): its form, recomputed by the test with its own
 * secret; the roundings of E-01; the secret, refused at construction and never shown. The secret is
 * drawn at each run.
 */
class FormTokenServiceTest {

	private static final Instant NOW = Instant.parse("2026-10-30T10:00:00Z");

	private static final Duration MIN_AGE = Duration.ofSeconds(3);

	private static final Duration MAX_AGE = Duration.ofHours(2);

	private final String secret = TestSecrets.draw(32);

	private final Clock clock = Clock.fixed(NOW, ZoneOffset.UTC);

	private final FormTokenService service = service(this.secret, MIN_AGE, MAX_AGE);

	@Test
	void aTokenHasTheFormOfPb02() throws Exception {
		String token = this.service.issue();
		assertThat(token).hasSize(79).matches("v1\\.[A-Za-z0-9_-]{32}\\.[A-Za-z0-9_-]{43}");
		String[] parts = token.split("\\.");
		ByteBuffer payload = ByteBuffer.wrap(Base64.getUrlDecoder().decode(parts[1]));
		assertThat(payload.remaining()).isEqualTo(24);
		assertThat(payload.getLong()).isEqualTo(NOW.toEpochMilli());
		assertThat(Base64.getUrlDecoder().decode(parts[2])).isEqualTo(hmac(this.secret, "v1." + parts[1]));
		// Issued in the same millisecond, told apart by their random bytes.
		assertThat(this.service.issue()).isNotEqualTo(token);
	}

	/** The minimal delay rounded up to the second, the maximal age rounded down. */
	@ParameterizedTest
	@CsvSource({ "PT3S, PT2H, 3, 7200", "PT1.5S, PT1H59M59.999S, 2, 7199", "PT0S, PT1M0.001S, 0, 60",
			"PT0.001S, PT2M, 1, 120" })
	void e01RoundsTheDelaysToTheSecond(Duration minAge, Duration maxAge, long minDelay, long expiresIn) {
		FormTokenService service = service(this.secret, minAge, maxAge);
		assertThat(service.minDelaySeconds()).isEqualTo(minDelay);
		assertThat(service.expiresInSeconds()).isEqualTo(expiresIn);
	}

	static Stream<Arguments> wrongSecrets() {
		String missing = "CONTACT_TOKEN_SECRET is missing: set it to at least 32 random bytes in standard Base64";
		String unreadable = "CONTACT_TOKEN_SECRET is not readable as standard Base64";
		String tooShort = "CONTACT_TOKEN_SECRET is too short: it must decode to at least 32 bytes";
		byte[] urlSafe = new byte[32];
		new SecureRandom().nextBytes(urlSafe);
		// 0xFB: "+" in standard Base64, "-" in the URL-safe one.
		urlSafe[0] = (byte) 0xFB;
		return Stream.of(arguments(null, missing), arguments("", missing), arguments(TestSecrets.draw(16), tooShort),
				arguments(TestSecrets.draw(31), tooShort), arguments("*" + TestSecrets.draw(32), unreadable),
				arguments(TestSecrets.draw(32) + "\n", unreadable),
				arguments(Base64.getUrlEncoder().encodeToString(urlSafe), unreadable));
	}

	/** The exact message: the variable, never a part of the value, and no cause that could quote one. */
	@ParameterizedTest
	@MethodSource("wrongSecrets")
	void aWrongSecretStopsTheStartup(@Nullable String secret, String message) {
		assertThatIllegalStateException().isThrownBy(() -> service(secret, MIN_AGE, MAX_AGE))
			.withMessage(message)
			.withNoCause();
	}

	@ParameterizedTest
	@ValueSource(ints = { 32, 33, 64 })
	void aSecretOf32BytesOrMoreIsAccepted(int bytes) {
		assertThat(service(TestSecrets.draw(bytes), MIN_AGE, MAX_AGE).issue()).hasSize(79);
	}

	@Test
	void itsTextNeverShowsTheSecret() {
		assertThat(this.service).hasToString("FormTokenService[secret hidden]");
	}

	private FormTokenService service(@Nullable String secret, Duration minAge, Duration maxAge) {
		return new FormTokenService(secret, new ContactProperties(List.of(), minAge, maxAge), this.clock);
	}

	/** The HMAC-SHA256 of the ASCII bytes of {@code text}, computed by the test. */
	static byte[] hmac(String secret, String text) throws GeneralSecurityException {
		Mac mac = Mac.getInstance("HmacSHA256");
		mac.init(new SecretKeySpec(Base64.getDecoder().decode(secret), "HmacSHA256"));
		return mac.doFinal(text.getBytes(StandardCharsets.US_ASCII));
	}

}
