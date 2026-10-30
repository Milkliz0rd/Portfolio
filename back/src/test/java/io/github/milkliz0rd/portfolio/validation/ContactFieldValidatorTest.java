package io.github.milkliz0rd.portfolio.validation;

import static io.github.milkliz0rd.portfolio.validation.ContactFieldValidator.Reason.INVALID_EMAIL;
import static io.github.milkliz0rd.portfolio.validation.ContactFieldValidator.Reason.LINE_BREAK;
import static io.github.milkliz0rd.portfolio.validation.ContactFieldValidator.Reason.REQUIRED;
import static io.github.milkliz0rd.portfolio.validation.ContactFieldValidator.Reason.TOO_LONG;
import static io.github.milkliz0rd.portfolio.validation.ContactFieldValidator.reasonFor;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.arguments;

import java.util.Arrays;
import java.util.stream.Stream;

import io.github.milkliz0rd.portfolio.validation.ContactField.Kind;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;

/** The reasons of the contract, section 3: at most one per field, the first in the contract's order. */
class ContactFieldValidatorTest {

	private static final String AT = "@";

	private static final String EMOJI = Character.toString(0x1F600);

	/** An address of 64 + 1 + 183 + 6 = 254 characters, valid. */
	private static final String ADDRESS_254 = "a".repeat(64) + AT + ("b".repeat(60) + ".").repeat(3) + "c".repeat(6);

	static Stream<Arguments> blankValues() {
		return Arrays.stream(Kind.values())
			.flatMap((kind) -> Stream.of(null, "", " ", "\u3000\t\u00A0 ", "\n").map((value) -> arguments(value, kind)));
	}

	@ParameterizedTest
	@MethodSource("blankValues")
	void anAbsentEmptyOrBlankValueIsRequired(String value, Kind kind) {
		assertThat(reasonFor(value, 100, kind)).isEqualTo(REQUIRED);
	}

	@ParameterizedTest
	@CsvSource({ "100, LINE", "5000, TEXT" })
	void theMaximumLengthIsAllowedAndOneMoreIsTooLong(int maxLength, Kind kind) {
		assertThat(reasonFor("x".repeat(maxLength), maxLength, kind)).isNull();
		assertThat(reasonFor("x".repeat(maxLength + 1), maxLength, kind)).isEqualTo(TOO_LONG);
	}

	@Test
	void anAddressOf254CharactersIsAllowedAnd255IsTooLong() {
		assertThat(ADDRESS_254).hasSize(254);
		assertThat(reasonFor(ADDRESS_254, 254, Kind.EMAIL)).isNull();
		assertThat(reasonFor(ADDRESS_254 + "c", 254, Kind.EMAIL)).isEqualTo(TOO_LONG);
	}

	@Test
	void aCharacterIsAUtf16CodeUnitSoAnEmojiCountsForTwo() {
		assertThat(EMOJI).hasSize(2);
		assertThat(reasonFor(EMOJI.repeat(50), 100, Kind.LINE)).isNull();
		assertThat(reasonFor(EMOJI.repeat(51), 100, Kind.LINE)).isEqualTo(TOO_LONG);
	}

	@Test
	void theLengthIsMeasuredAfterTheEdgeSpacesAreRemoved() {
		assertThat(reasonFor("  " + "s".repeat(100) + "\u3000\t", 100, Kind.LINE)).isNull();
		assertThat(reasonFor(" " + "m".repeat(5000) + "\n\n", 5000, Kind.TEXT)).isNull();
	}

	/** The five line breaks of the contract. */
	static Stream<String> lineBreaks() {
		return Stream.of(0x000A, 0x000D, 0x0085, 0x2028, 0x2029).map(Character::toString);
	}

	@ParameterizedTest
	@MethodSource("lineBreaks")
	void aLineBreakIsRefusedInALineAllowedInTheMessageAndInvalidInAnAddress(String lineBreak) {
		assertThat(reasonFor("Jean" + lineBreak + "Pierre", 100, Kind.LINE)).isEqualTo(LINE_BREAK);
		assertThat(reasonFor("Bonjour," + lineBreak + "merci.", 5000, Kind.TEXT)).isNull();
		assertThat(reasonFor("visiteur" + lineBreak + AT + "exemple.fr", 254, Kind.EMAIL)).isEqualTo(INVALID_EMAIL);
	}

	/** Tab, vertical tab, form feed and other spaces are not line breaks of the contract. */
	@ParameterizedTest
	@ValueSource(ints = { 0x0009, 0x000B, 0x000C, 0x00A0, 0x3000, 0x001C, 0x001E })
	void anotherSpaceInsideALineIsAllowed(int codePoint) {
		assertThat(reasonFor("Jean" + Character.toString(codePoint) + "Pierre", 100, Kind.LINE)).isNull();
	}

	@Test
	void aFieldGetsOnlyTheFirstReasonInTheContractOrder() {
		// too-long before line-break, too-long before invalid-email.
		assertThat(reasonFor("a\nb".repeat(40), 100, Kind.LINE)).isEqualTo(TOO_LONG);
		assertThat(reasonFor("sans-arobase".repeat(30), 254, Kind.EMAIL)).isEqualTo(TOO_LONG);
		// A line break at an edge is an edge space: removed, it leaves nothing, or a valid value.
		assertThat(reasonFor("\r\n", 100, Kind.LINE)).isEqualTo(REQUIRED);
		assertThat(reasonFor("Sujet\n", 100, Kind.LINE)).isNull();
	}

	@Test
	void anAddressFollowsTheSyntaxOfTheContract() {
		assertThat(reasonFor("Visiteur" + AT + "Exemple.fr", 254, Kind.EMAIL)).isNull();
		assertThat(reasonFor("visiteur" + AT + "exemple", 254, Kind.EMAIL)).isEqualTo(INVALID_EMAIL);
		assertThat(reasonFor("élise" + AT + "exemple.fr", 254, Kind.EMAIL)).isEqualTo(INVALID_EMAIL);
		assertThat(reasonFor("visiteur(at)exemple", 254, Kind.EMAIL)).isEqualTo(INVALID_EMAIL);
		// The other natures never get invalid-email.
		assertThat(reasonFor("visiteur(at)exemple", 100, Kind.LINE)).isNull();
	}

}
