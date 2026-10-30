package io.github.milkliz0rd.portfolio;

import java.security.SecureRandom;
import java.util.Base64;

/** Secrets drawn by the tests at each run, never written in the code (PB-07). */
public final class TestSecrets {

	private static final SecureRandom RANDOM = new SecureRandom();

	private TestSecrets() {
	}

	/** {@code bytes} random bytes in standard Base64, the form of {@code CONTACT_TOKEN_SECRET}. */
	public static String draw(int bytes) {
		byte[] secret = new byte[bytes];
		RANDOM.nextBytes(secret);
		return Base64.getEncoder().encodeToString(secret);
	}

}
