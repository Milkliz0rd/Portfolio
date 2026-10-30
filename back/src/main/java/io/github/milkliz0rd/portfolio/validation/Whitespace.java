package io.github.milkliz0rd.portfolio.validation;

import org.jspecify.annotations.Nullable;

/**
 * The edge spaces of the contract (section 3): exactly the 25 code points of the Unicode
 * White_Space property, those {@code \p{IsWhite_Space}} matches, removed at the start and at the end
 * of a value. Neither {@link String#trim()}, which removes every control character up to U+0020,
 * nor {@link String#strip()}, which keeps U+0085, U+00A0, U+2007 and U+202F but removes U+001C to
 * U+001F. A scan rather than a regular expression: an expression anchored at the end of a long run
 * of spaces backtracks in quadratic time.
 */
public final class Whitespace {

	private Whitespace() {
	}

	/** The value without its edge spaces; {@code null} stays {@code null}. */
	public static @Nullable String strip(@Nullable String value) {
		if (value == null) {
			return null;
		}
		int start = 0;
		int end = value.length();
		while (start < end && isWhiteSpace(value.charAt(start))) {
			start++;
		}
		while (end > start && isWhiteSpace(value.charAt(end - 1))) {
			end--;
		}
		return value.substring(start, end);
	}

	/** One of the 25 code points; all of them are in the Basic Multilingual Plane, so a char is enough. */
	private static boolean isWhiteSpace(char c) {
		return (c >= 0x0009 && c <= 0x000D) || c == 0x0020 || c == 0x0085 || c == 0x00A0 || c == 0x1680
				|| (c >= 0x2000 && c <= 0x200A) || c == 0x2028 || c == 0x2029 || c == 0x202F || c == 0x205F
				|| c == 0x3000;
	}

}
