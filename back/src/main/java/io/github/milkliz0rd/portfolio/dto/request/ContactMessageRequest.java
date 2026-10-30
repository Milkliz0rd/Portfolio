package io.github.milkliz0rd.portfolio.dto.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.github.milkliz0rd.portfolio.validation.ContactField;
import io.github.milkliz0rd.portfolio.validation.ContactField.Kind;
import io.github.milkliz0rd.portfolio.validation.Whitespace;
import org.jspecify.annotations.Nullable;
import tools.jackson.databind.annotation.JsonDeserialize;

/**
 * The body of E-02 (contract, section 3): seven properties, each a string or {@code null}, an absent
 * one being {@code null}; any other property is ignored. The constructor removes the edge spaces of
 * the five fields and of the honeypot, and keeps the token as received. Each field carries a single
 * constraint; the honeypot and the token are left to the filter chain (TK-22).
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ContactMessageRequest(
		@JsonDeserialize(using = StrictStringDeserializer.class) @ContactField(maxLength = 100,
				kind = Kind.LINE) @Nullable String lastName,
		@JsonDeserialize(using = StrictStringDeserializer.class) @ContactField(maxLength = 100,
				kind = Kind.LINE) @Nullable String firstName,
		@JsonDeserialize(using = StrictStringDeserializer.class) @ContactField(maxLength = 254,
				kind = Kind.EMAIL) @Nullable String email,
		@JsonDeserialize(using = StrictStringDeserializer.class) @ContactField(maxLength = 100,
				kind = Kind.LINE) @Nullable String subject,
		@JsonDeserialize(using = StrictStringDeserializer.class) @ContactField(maxLength = 5000,
				kind = Kind.TEXT) @Nullable String message,
		@JsonDeserialize(using = StrictStringDeserializer.class) @Nullable String website,
		@JsonDeserialize(using = StrictStringDeserializer.class) @Nullable String formToken) {

	/** The JSON names of the five fields, in the order of the form: the order of validationErrors. */
	public static final List<String> FIELDS = List.of("lastName", "firstName", "email", "subject", "message");

	public ContactMessageRequest {
		lastName = Whitespace.strip(lastName);
		firstName = Whitespace.strip(firstName);
		email = Whitespace.strip(email);
		subject = Whitespace.strip(subject);
		message = Whitespace.strip(message);
		website = Whitespace.strip(website);
	}

	/** Never the values: an address, the fields of the form and the token stay out of any text. */
	@Override
	public String toString() {
		return "ContactMessageRequest[values hidden]";
	}

}
