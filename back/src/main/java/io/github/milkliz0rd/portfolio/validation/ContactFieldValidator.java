package io.github.milkliz0rd.portfolio.validation;

import io.github.milkliz0rd.portfolio.validation.ContactField.Kind;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.jspecify.annotations.Nullable;

/**
 * Checks a field of the contact form against the rules of the contract (section 3), after its edge
 * spaces are removed, and gives at most one reason: the first that applies, in the order required,
 * too-long, line-break, invalid-email.
 */
public class ContactFieldValidator implements ConstraintValidator<ContactField, String> {

	/** The reasons of the contract, in their order; the code is what validationErrors carries. */
	public enum Reason {

		REQUIRED("required"), TOO_LONG("too-long"), LINE_BREAK("line-break"), INVALID_EMAIL("invalid-email");

		private final String code;

		Reason(String code) {
			this.code = code;
		}

		public String code() {
			return this.code;
		}

	}

	private int maxLength;

	private Kind kind = Kind.TEXT;

	@Override
	public void initialize(ContactField field) {
		this.maxLength = field.maxLength();
		this.kind = field.kind();
	}

	@Override
	public boolean isValid(@Nullable String value, ConstraintValidatorContext context) {
		Reason reason = reasonFor(value, this.maxLength, this.kind);
		if (reason == null) {
			return true;
		}
		context.disableDefaultConstraintViolation();
		context.buildConstraintViolationWithTemplate(reason.code()).addConstraintViolation();
		return false;
	}

	/** The first reason that applies to the value, or {@code null} when the value is valid. */
	public static @Nullable Reason reasonFor(@Nullable String value, int maxLength, Kind kind) {
		String stripped = Whitespace.strip(value);
		if (stripped == null || stripped.isEmpty()) {
			return Reason.REQUIRED;
		}
		if (stripped.length() > maxLength) {
			return Reason.TOO_LONG;
		}
		if (kind == Kind.LINE && containsLineBreak(stripped)) {
			return Reason.LINE_BREAK;
		}
		if (kind == Kind.EMAIL && !EmailSyntax.isValid(stripped)) {
			return Reason.INVALID_EMAIL;
		}
		return null;
	}

	/** U+000A, U+000D, U+0085, U+2028 or U+2029, the line breaks of the contract. */
	private static boolean containsLineBreak(String value) {
		for (int i = 0; i < value.length(); i++) {
			char c = value.charAt(i);
			if (c == 0x000A || c == 0x000D || c == 0x0085 || c == 0x2028 || c == 0x2029) {
				return true;
			}
		}
		return false;
	}

}
