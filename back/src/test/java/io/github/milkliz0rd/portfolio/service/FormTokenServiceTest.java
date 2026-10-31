package io.github.milkliz0rd.portfolio.service;

import static io.github.milkliz0rd.portfolio.service.FormTokenService.Verification.EXPIRED;
import static io.github.milkliz0rd.portfolio.service.FormTokenService.Verification.FORGED;
import static io.github.milkliz0rd.portfolio.service.FormTokenService.Verification.MISSING;
import static io.github.milkliz0rd.portfolio.service.FormTokenService.Verification.TOO_RECENT;
import static io.github.milkliz0rd.portfolio.service.FormTokenService.Verification.VALID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalStateException;
import static org.junit.jupiter.params.provider.Arguments.arguments;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Stream;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import io.github.milkliz0rd.portfolio.MutableClock;
import io.github.milkliz0rd.portfolio.TestSecrets;
import io.github.milkliz0rd.portfolio.config.ContactProperties;
import io.github.milkliz0rd.portfolio.service.FormTokenService.Verification;
import org.jspecify.annotations.Nullable;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

/**
 * The form token without Spring (PB-02, PB-07): its form, recomputed by the test with its own
 * secret; each case of the verification, in order; the bounds, included, to the millisecond; the
 * roundings of E-01; the secret, refused at construction and never shown. The clock is moved, never
 * awaited, and the secret is drawn at each run.
 */
class FormTokenServiceTest {

	private static final Instant NOW = Instant.parse("2026-10-30T10:00:00Z");

	private static final Duration MIN_AGE = Duration.ofSeconds(3);

	private static final Duration MAX_AGE = Duration.ofHours(2);

	private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();

	private final String secret = TestSecrets.draw(32);

	private final MutableClock clock = new MutableClock(NOW);

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

	@Test
	void aValidTokenServesSeveralTimes() throws Exception {
		String token = this.service.issue();
		String signedByTheTest = signed(this.secret, 24, 32);
		this.clock.advance(MIN_AGE);
		assertThat(this.service.verify(token)).isEqualTo(VALID);
		assertThat(this.service.verify(token)).isEqualTo(VALID);
		assertThat(this.service.verify(signedByTheTest)).isEqualTo(VALID);
	}

	/** Nothing is drawn at startup: with the same secret, a token survives the sleep and a restart. */
	@Test
	void aTokenSurvivesARestart() {
		String token = this.service.issue();
		this.clock.advance(MIN_AGE);
		assertThat(service(this.secret, MIN_AGE, MAX_AGE).verify(token)).isEqualTo(VALID);
	}

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = { " ", "\t　   " })
	void aBlankTokenIsMissing(@Nullable String token) {
		assertThat(this.service.verify(token)).isEqualTo(MISSING);
	}

	/** Builds a forged token from a valid one and the secret. */
	interface Forgery {

		String apply(String token, String secret) throws GeneralSecurityException;

	}

	static Stream<Arguments> forgeries() {
		// A token is "v1", ".", 32 characters of payload (3 to 34), ".", 43 of signature (36 to 78).
		return Stream.of(arguments("signature changed", (Forgery) (t, s) -> change(t, 50)),
				arguments("payload changed", (Forgery) (t, s) -> change(t, 10)),
				arguments("other prefix", (Forgery) (t, s) -> "v2" + t.substring(2)),
				arguments("prefix in capitals", (Forgery) (t, s) -> "V1" + t.substring(2)),
				arguments("standard Base64", (Forgery) (t, s) -> t.substring(0, 50) + "+" + t.substring(51)),
				arguments("unreadable Base64", (Forgery) (t, s) -> t.substring(0, 50) + "*" + t.substring(51)),
				arguments("padding", (Forgery) (t, s) -> t + "="),
				arguments("two parts", (Forgery) (t, s) -> t.substring(0, 35)),
				arguments("four parts", (Forgery) (t, s) -> t + ".x"),
				arguments("empty parts", (Forgery) (t, s) -> "v1.."),
				arguments("more than 200 characters", (Forgery) (t, s) -> t + "a".repeat(122)),
				arguments("payload of 23 bytes", (Forgery) (t, s) -> signed(s, 23, 32)),
				arguments("payload of 25 bytes", (Forgery) (t, s) -> signed(s, 25, 32)),
				arguments("signature of 31 bytes", (Forgery) (t, s) -> signed(s, 24, 31)),
				arguments("signature of 33 bytes", (Forgery) (t, s) -> signed(s, 24, 33)),
				arguments("other secret", (Forgery) (t, s) -> signed(TestSecrets.draw(32), 24, 32)));
	}

	@ParameterizedTest(name = "{0}")
	@MethodSource("forgeries")
	void aForgedTokenIsForgedAtAnyAge(String name, Forgery forgery) throws Exception {
		String forged = forgery.apply(this.service.issue(), this.secret);
		// The form and the signature come first: neither too recent at once, nor expired later.
		assertThat(this.service.verify(forged)).isEqualTo(FORGED);
		this.clock.advance(MAX_AGE.plusHours(1));
		assertThat(this.service.verify(forged)).isEqualTo(FORGED);
	}

	/** From 3 s to 2 h after the issue, both included; one issued in the future is too recent. */
	@ParameterizedTest
	@CsvSource({ "-1, TOO_RECENT", "0, TOO_RECENT", "2999, TOO_RECENT", "3000, VALID", "7200000, VALID",
			"7200001, EXPIRED" })
	void theBoundsAreIncludedToTheMillisecond(long ageMillis, Verification verification) {
		String token = this.service.issue();
		this.clock.advance(Duration.ofMillis(ageMillis));
		assertThat(this.service.verify(token)).isEqualTo(verification);
	}

	@Test
	void withoutDelayAFutureTokenIsTooRecent() {
		FormTokenService service = service(this.secret, Duration.ZERO, MAX_AGE);
		String token = service.issue();
		assertThat(service.verify(token)).isEqualTo(VALID);
		this.clock.advance(Duration.ofMillis(-1));
		assertThat(service.verify(token)).isEqualTo(TOO_RECENT);
		this.clock.advance(MAX_AGE.plusMillis(2));
		assertThat(service.verify(token)).isEqualTo(EXPIRED);
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
		return new FormTokenService(secret,
				new ContactProperties(List.of(), minAge, maxAge, Duration.ofSeconds(10), "https://api.brevo.com/v3"),
				this.clock);
	}

	/** The HMAC-SHA256 of the ASCII bytes of {@code text}, computed by the test. */
	static byte[] hmac(String secret, String text) throws GeneralSecurityException {
		Mac mac = Mac.getInstance("HmacSHA256");
		mac.init(new SecretKeySpec(Base64.getDecoder().decode(secret), "HmacSHA256"));
		return mac.doFinal(text.getBytes(StandardCharsets.US_ASCII));
	}

	/** A token issued now, signed with {@code secret}, its payload and signature of the given lengths. */
	static String signed(String secret, int payloadBytes, int signatureBytes) throws GeneralSecurityException {
		byte[] payload = ByteBuffer.allocate(payloadBytes).putLong(NOW.toEpochMilli()).array();
		String signed = "v1." + ENCODER.encodeToString(payload);
		return signed + "." + ENCODER.encodeToString(Arrays.copyOf(hmac(secret, signed), signatureBytes));
	}

	/** The token with another character of the URL-safe alphabet at {@code index}. */
	static String change(String token, int index) {
		char other = (token.charAt(index) == 'A') ? 'B' : 'A';
		return token.substring(0, index) + other + token.substring(index + 1);
	}

}
