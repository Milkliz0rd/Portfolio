package io.github.milkliz0rd.portfolio.validation;

import java.util.regex.Pattern;

/**
 * The address syntax of the contract (section 3): a "valid e-mail address" of the HTML standard,
 * with at least one dot after the at sign. The grammar admits ASCII characters only, so a line break
 * or any other character outside it makes the address invalid; the case is kept.
 */
public final class EmailSyntax {

	/**
	 * The expression the HTML standard gives for its grammar, whose last group, a dot and a label,
	 * appears here at least once instead of any number of times. A label has 63 characters at most.
	 */
	private static final Pattern ADDRESS = Pattern.compile("[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+"
			+ "@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+");

	private EmailSyntax() {
	}

	/** Whether the whole value is an address of the contract's syntax. */
	public static boolean isValid(String address) {
		return ADDRESS.matcher(address).matches();
	}

}
