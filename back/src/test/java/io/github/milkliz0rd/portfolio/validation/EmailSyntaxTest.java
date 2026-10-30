package io.github.milkliz0rd.portfolio.validation;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;

/**
 * The address syntax of the contract, section 3. The at sign is written (at) and put back by the
 * test, so that no address is written in the public repository.
 */
class EmailSyntaxTest {

	@ParameterizedTest
	@ValueSource(strings = { "a(at)b.co", "Prenom.Nom(at)Exemple.FR", "x(at)sous-domaine.exemple.org", "1(at)2.3",
			"!#$%&'*+-/=?^_`{|}~(at)exemple.org", ".debut..double.fin.(at)exemple.org", "a(at)b-c.d-e" })
	void anAddressOfTheHtmlGrammarWithADotAfterTheAtSignIsValid(String address) {
		assertThat(EmailSyntax.isValid(at(address))).isTrue();
	}

	@Test
	void aLabelHas63CharactersAtMost() {
		assertThat(EmailSyntax.isValid(at("a(at)" + "b".repeat(63) + ".fr"))).isTrue();
		assertThat(EmailSyntax.isValid(at("a(at)" + "b".repeat(64) + ".fr"))).isFalse();
		assertThat(EmailSyntax.isValid(at("a(at)exemple." + "c".repeat(64)))).isFalse();
	}

	@ParameterizedTest
	@ValueSource(strings = {
			// A domain without a dot: the HTML grammar alone accepts it, the contract does not.
			"visiteur(at)exemple", "visiteur(at)localhost",
			// Outside the HTML grammar.
			"visiteur", "(at)exemple.fr", "visiteur(at)", "a(at)(at)exemple.fr", "a(at)exemple.", "a(at).exemple.fr",
			"a(at)exemple..fr", "a(at)-exemple.fr", "a(at)exemple-.fr", "a(at)exem_ple.fr", "a b(at)exemple.fr",
			"a(at)exemple.fr ", " a(at)exemple.fr", "\"a\"(at)exemple.fr", "a(b(at)exemple.fr", "a,b(at)exemple.fr",
			"a(at)exemple.fr.",
			// ASCII only.
			"éléonore(at)exemple.fr", "a(at)exémple.fr", "a＠exemple.fr", "a(at)exemple.ｆｒ" })
	void anyOtherAddressIsInvalid(String address) {
		assertThat(EmailSyntax.isValid(at(address))).isFalse();
	}

	/** The five line breaks of the contract, and a tab, wherever they stand. */
	static Stream<String> addressesWithALineBreak() {
		return Stream.of(0x000A, 0x000D, 0x0085, 0x2028, 0x2029, 0x0009)
			.map(Character::toString)
			.flatMap((lineBreak) -> Stream.of("a" + lineBreak + "(at)exemple.fr", "a(at)exem" + lineBreak + "ple.fr",
					"a(at)exemple.fr" + lineBreak, lineBreak + "a(at)exemple.fr"));
	}

	@ParameterizedTest
	@MethodSource("addressesWithALineBreak")
	void anAddressWithALineBreakIsInvalid(String address) {
		assertThat(EmailSyntax.isValid(at(address))).isFalse();
	}

	private static String at(String address) {
		return address.replace("(at)", "@");
	}

}
