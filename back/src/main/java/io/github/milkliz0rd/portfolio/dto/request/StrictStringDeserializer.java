package io.github.milkliz0rd.portfolio.dto.request;

import tools.jackson.core.JsonParser;
import tools.jackson.core.JsonToken;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.deser.std.StdScalarDeserializer;

/**
 * A property of E-02 is a string or {@code null}, nothing else (contract, section 3). Jackson would
 * turn a number or a boolean into its text; here any other value makes the body unreadable, hence
 * the contract's 400 with {@code validationErrors} at {@code null}. A {@code null} never reaches
 * this class: Jackson gives {@code null} itself.
 */
public class StrictStringDeserializer extends StdScalarDeserializer<String> {

	public StrictStringDeserializer() {
		super(String.class);
	}

	@Override
	public String deserialize(JsonParser parser, DeserializationContext context) {
		if (parser.hasToken(JsonToken.VALUE_STRING)) {
			return parser.getString();
		}
		return context.reportInputMismatch(this, "A string or null is expected");
	}

}
