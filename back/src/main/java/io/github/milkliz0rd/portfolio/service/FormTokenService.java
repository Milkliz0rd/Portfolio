package io.github.milkliz0rd.portfolio.service;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.util.Arrays;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import io.github.milkliz0rd.portfolio.config.ContactProperties;
import io.github.milkliz0rd.portfolio.validation.Whitespace;
import org.jspecify.annotations.Nullable;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * The signed and timestamped form token (PB-02), issued by E-01 and verified by the filter chain of
 * E-02 (TK-22). A token is {@code v1.<payload>.<signature>}: the payload, 24 bytes, is the instant of
 * issue in milliseconds since the Unix epoch (8 bytes, big-endian) followed by 16 bytes drawn by
 * SecureRandom; the signature is the HMAC-SHA256 of the ASCII bytes of {@code v1.<payload>}; both
 * in URL-safe Base64 without padding, 79 characters in all. Nothing is stored: a valid token may
 * serve several times. The secret, {@code CONTACT_TOKEN_SECRET}, is checked here rather than by the
 * validation of the properties, whose failure report shows the value; no message, text or log of
 * this class shows it, nor a token. Final, since its constructor refuses a wrong secret.
 */
@Service
public final class FormTokenService {

	/** The result of a verification; PB-02 checks them in this order, after the signature. */
	public enum Verification {

		VALID, MISSING, FORGED, TOO_RECENT, EXPIRED

	}

	private static final String PREFIX = "v1";

	private static final String ALGORITHM = "HmacSHA256";

	private static final int MAX_LENGTH = 200;

	private static final int PAYLOAD_BYTES = 24;

	private static final int RANDOM_BYTES = 16;

	private static final int SIGNATURE_BYTES = 32;

	private static final int MIN_SECRET_BYTES = 32;

	private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();

	private final SecretKeySpec key;

	private final Clock clock;

	private final Duration minAge;

	private final Duration maxAge;

	private final SecureRandom random = new SecureRandom();

	public FormTokenService(@Value("${contact.token-secret:}") @Nullable String secret, ContactProperties properties,
			Clock clock) {
		byte[] decoded = decodeSecret(secret);
		try {
			this.key = new SecretKeySpec(decoded, ALGORITHM);
		}
		finally {
			Arrays.fill(decoded, (byte) 0);
		}
		this.clock = clock;
		this.minAge = properties.tokenMinAge();
		this.maxAge = properties.tokenMaxAge();
	}

	/** A new token, issued at the instant of the clock. */
	public String issue() {
		byte[] randomBytes = new byte[RANDOM_BYTES];
		this.random.nextBytes(randomBytes);
		byte[] payload = ByteBuffer.allocate(PAYLOAD_BYTES).putLong(this.clock.millis()).put(randomBytes).array();
		String signed = PREFIX + "." + ENCODER.encodeToString(payload);
		return signed + "." + ENCODER.encodeToString(sign(signed));
	}

	/** The minimal delay in force, rounded up to the second, as E-01 gives it. */
	public long minDelaySeconds() {
		return this.minAge.getSeconds() + ((this.minAge.getNano() > 0) ? 1 : 0);
	}

	/** The maximal age in force, rounded down to the second, as E-01 gives it. */
	public long expiresInSeconds() {
		return this.maxAge.getSeconds();
	}

	/**
	 * Checks a token as received, in the order of PB-02: missing, forged (form, then signature, compared
	 * in constant time), too recent, expired. Both bounds are included: a token is valid from the minimal
	 * delay to the maximal age after its issue; one issued in the future is too recent.
	 */
	public Verification verify(@Nullable String token) {
		if (token == null || "".equals(Whitespace.strip(token))) {
			return Verification.MISSING;
		}
		if (token.length() > MAX_LENGTH) {
			return Verification.FORGED;
		}
		String[] parts = token.split("\\.", -1);
		if (parts.length != 3 || !PREFIX.equals(parts[0])) {
			return Verification.FORGED;
		}
		byte[] payload = decode(parts[1]);
		byte[] signature = decode(parts[2]);
		if (payload.length != PAYLOAD_BYTES || signature.length != SIGNATURE_BYTES
				|| !MessageDigest.isEqual(sign(PREFIX + "." + parts[1]), signature)) {
			return Verification.FORGED;
		}
		Duration age = Duration.ofMillis(this.clock.millis() - ByteBuffer.wrap(payload).getLong());
		if (age.compareTo(this.minAge) < 0) {
			return Verification.TOO_RECENT;
		}
		return (age.compareTo(this.maxAge) > 0) ? Verification.EXPIRED : Verification.VALID;
	}

	/** Never the secret. */
	@Override
	public String toString() {
		return "FormTokenService[secret hidden]";
	}

	/** The bytes of a part in URL-safe Base64 without padding; none if it is not one. */
	private static byte[] decode(String part) {
		if (part.indexOf('=') >= 0) {
			return new byte[0];
		}
		try {
			return Base64.getUrlDecoder().decode(part);
		}
		catch (IllegalArgumentException ex) {
			return new byte[0];
		}
	}

	/** A Mac per call: the class is not safe between threads. */
	private byte[] sign(String signed) {
		try {
			Mac mac = Mac.getInstance(ALGORITHM);
			mac.init(this.key);
			return mac.doFinal(signed.getBytes(StandardCharsets.US_ASCII));
		}
		catch (GeneralSecurityException ex) {
			throw new IllegalStateException(ALGORITHM + " is not available", ex);
		}
	}

	/** The secret's bytes; the messages name the variable, never a part of its value, and chain no cause. */
	private static byte[] decodeSecret(@Nullable String secret) {
		if (secret == null || secret.isEmpty()) {
			throw new IllegalStateException(
					"CONTACT_TOKEN_SECRET is missing: set it to at least 32 random bytes in standard Base64");
		}
		byte[] decoded;
		try {
			decoded = Base64.getDecoder().decode(secret);
		}
		catch (IllegalArgumentException ex) {
			// Its message may quote a character of the secret.
			throw new IllegalStateException("CONTACT_TOKEN_SECRET is not readable as standard Base64");
		}
		if (decoded.length < MIN_SECRET_BYTES) {
			Arrays.fill(decoded, (byte) 0);
			throw new IllegalStateException("CONTACT_TOKEN_SECRET is too short: it must decode to at least 32 bytes");
		}
		return decoded;
	}

}
