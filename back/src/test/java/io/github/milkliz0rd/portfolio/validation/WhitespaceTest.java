package io.github.milkliz0rd.portfolio.validation;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;

/** The edge spaces of the contract, section 3: exactly 25 code points, nothing else. */
class WhitespaceTest {

	/** The list of the contract, in its order. */
	static final List<Integer> CONTRACT = List.of(0x0009, 0x000A, 0x000B, 0x000C, 0x000D, 0x0020, 0x0085, 0x00A0,
			0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x2028,
			0x2029, 0x202F, 0x205F, 0x3000);

	static List<Integer> contractCodePoints() {
		return CONTRACT;
	}

	@ParameterizedTest
	@MethodSource("contractCodePoints")
	void eachCodePointOfTheContractIsRemovedAtBothEdgesAndKeptInside(int codePoint) {
		String space = Character.toString(codePoint);
		assertThat(Whitespace.strip(space + space + "a" + space + "b" + space)).isEqualTo("a" + space + "b");
	}

	/** U+FEFF, U+180E, the other control characters and the zero width space are not edge spaces. */
	@ParameterizedTest
	@ValueSource(ints = { 0xFEFF, 0x180E, 0x001C, 0x001D, 0x001E, 0x001F, 0x0000, 0x0008, 0x200B, 0x2060 })
	void anotherCharacterIsKept(int codePoint) {
		String other = Character.toString(codePoint);
		assertThat(Whitespace.strip(other + "a" + other)).isEqualTo(other + "a" + other);
		assertThat(Whitespace.strip(" " + other + " ")).isEqualTo(other);
	}

	@Test
	void theCodePointsRemovedAreExactlyThoseOfIsWhiteSpace() {
		Pattern whiteSpace = Pattern.compile("\\p{IsWhite_Space}");
		List<Integer> matched = IntStream.rangeClosed(Character.MIN_CODE_POINT, Character.MAX_CODE_POINT)
			.filter((codePoint) -> whiteSpace.matcher(Character.toString(codePoint)).matches())
			.boxed()
			.toList();
		List<Integer> removed = IntStream.rangeClosed(Character.MIN_CODE_POINT, Character.MAX_CODE_POINT)
			.filter((codePoint) -> Whitespace.strip(Character.toString(codePoint)).isEmpty())
			.boxed()
			.toList();
		assertThat(matched).containsExactlyElementsOf(CONTRACT);
		assertThat(removed).containsExactlyElementsOf(CONTRACT);
	}

	@Test
	void nullStaysNullAndOnlySpacesGiveAnEmptyValue() {
		assertThat(Whitespace.strip(null)).isNull();
		assertThat(Whitespace.strip("")).isEmpty();
		assertThat(Whitespace.strip("\u3000 \t\u00A0")).isEmpty();
		assertThat(Whitespace.strip("sans espace")).isEqualTo("sans espace");
	}

}
