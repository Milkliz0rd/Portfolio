package io.github.milkliz0rd.portfolio.dto.request;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.assertj.core.api.Assertions.tuple;
import static org.junit.jupiter.params.provider.Arguments.arguments;

import java.lang.reflect.RecordComponent;
import java.util.Arrays;
import java.util.stream.Stream;

import io.github.milkliz0rd.portfolio.validation.ContactField;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import tools.jackson.databind.DatabindException;
import tools.jackson.databind.json.JsonMapper;

/** The body of E-02, read from JSON and validated by Bean Validation, without Spring. */
class ContactMessageRequestTest {

	private static final ValidatorFactory VALIDATION = Validation.buildDefaultValidatorFactory();

	private static final Validator VALIDATOR = VALIDATION.getValidator();

	private static final JsonMapper JSON = JsonMapper.builder().build();

	private static final String ADDRESS = "visiteur" + "@" + "exemple.fr";

	@AfterAll
	static void closeValidation() {
		VALIDATION.close();
	}

	@Test
	void theEdgeSpacesOfTheFiveFieldsAndOfTheHoneypotAreRemovedAndTheTokenIsKept() {
		ContactMessageRequest request = new ContactMessageRequest("\u3000Nom ", "\tPrénom\n", " " + ADDRESS + "\u00A0",
				" Sujet\u2029", "\u205FBonjour,\nmerci.\n\n", " piège ", " jeton ");
		assertThat(request).extracting(ContactMessageRequest::lastName, ContactMessageRequest::firstName,
				ContactMessageRequest::email, ContactMessageRequest::subject, ContactMessageRequest::message,
				ContactMessageRequest::website, ContactMessageRequest::formToken)
			.containsExactly("Nom", "Prénom", ADDRESS, "Sujet", "Bonjour,\nmerci.", "piège", " jeton ");
	}

	@Test
	void aValidMessageHasNoViolationWhateverItsHoneypotAndToken() {
		assertThat(VALIDATOR.validate(new ContactMessageRequest("Nom", "Prénom", ADDRESS, "Sujet", "Message", null, null)))
			.isEmpty();
		assertThat(VALIDATOR.validate(new ContactMessageRequest("Nom", "Prénom", ADDRESS, "Sujet", "Message",
				"x".repeat(9000), ""))).isEmpty();
	}

	@Test
	void eachFieldGetsOneViolationWhoseMessageIsTheCodeOfItsFirstReason() {
		ContactMessageRequest request = new ContactMessageRequest("", "p".repeat(101) + "\n" + "q", "sans-arobase",
				"a\nb", "  ", null, null);
		assertThat(VALIDATOR.validate(request))
			.extracting((violation) -> violation.getPropertyPath().toString(), ConstraintViolation::getMessage)
			.containsExactlyInAnyOrder(tuple("lastName", "required"), tuple("firstName", "too-long"),
					tuple("email", "invalid-email"), tuple("subject", "line-break"), tuple("message", "required"));
	}

	@Test
	void anAbsentPropertyIsNullAndAnUnknownOneIsIgnored() {
		ContactMessageRequest request = JSON.readValue(
				"{\"lastName\":\" Nom \",\"firstName\":null,\"other\":12,\"formToken\":\"jeton\"}",
				ContactMessageRequest.class);
		assertThat(request).isEqualTo(new ContactMessageRequest("Nom", null, null, null, null, null, "jeton"));
		assertThat(VALIDATOR.validate(request)).extracting(ConstraintViolation::getMessage)
			.containsExactly("required", "required", "required", "required");
	}

	static Stream<Arguments> valuesThatAreNotStrings() {
		return Arrays.stream(ContactMessageRequest.class.getRecordComponents())
			.map(RecordComponent::getName)
			.flatMap((name) -> Stream.of("12", "1.5", "true", "false", "[\"a\"]", "[]", "{\"a\":\"b\"}")
				.map((value) -> arguments(name, value)));
	}

	/** Jackson would otherwise turn a number or a boolean into its text. */
	@ParameterizedTest
	@MethodSource("valuesThatAreNotStrings")
	void aValueThatIsNeitherAStringNorNullIsRefused(String property, String value) {
		assertThatExceptionOfType(DatabindException.class)
			.isThrownBy(() -> JSON.readValue("{\"" + property + "\":" + value + "}", ContactMessageRequest.class));
	}

	@Test
	void theFieldsOfTheFormAreTheConstrainedComponentsInTheirOrder() throws NoSuchFieldException {
		Stream.Builder<String> constrained = Stream.builder();
		for (RecordComponent component : ContactMessageRequest.class.getRecordComponents()) {
			if (ContactMessageRequest.class.getDeclaredField(component.getName()).isAnnotationPresent(ContactField.class)) {
				constrained.add(component.getName());
			}
		}
		assertThat(constrained.build()).containsExactlyElementsOf(ContactMessageRequest.FIELDS);
	}

	@Test
	void theTextShowsNoValue() {
		assertThat(new ContactMessageRequest("Nom", "Prénom", ADDRESS, "Sujet", "Texte", "piège", "jeton"))
			.hasToString("ContactMessageRequest[values hidden]");
	}

}
