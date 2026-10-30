package io.github.milkliz0rd.portfolio.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/**
 * A field of the contact form (contract, section 3): its maximum length and its nature, the single
 * constraint of the field. Its validator gives at most one reason, whose code is the message.
 */
@Documented
@Constraint(validatedBy = ContactFieldValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ContactField {

	/** Never shown: a violation carries the code of its reason instead. */
	String message() default "invalid";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	/** The maximum length, in UTF-16 code units, after the edge spaces are removed. */
	int maxLength();

	Kind kind();

	/** The nature of a field, which decides the reasons it can get after required and too-long. */
	enum Kind {

		/** A line of plain text, without line break: last name, first name, subject. */
		LINE,

		/** Plain text, line breaks allowed: the message. */
		TEXT,

		/** An address of the contract's syntax. */
		EMAIL

	}

}
