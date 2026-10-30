package io.github.milkliz0rd.portfolio.web;

import static io.github.milkliz0rd.portfolio.controller.ContactMessageController.ROUTE;
import static io.github.milkliz0rd.portfolio.web.ContactMessageEndpointTest.ALLOWED;
import static io.github.milkliz0rd.portfolio.web.ContactMessageEndpointTest.preflight;
import static io.github.milkliz0rd.portfolio.web.RequestSizeLimitFilter.MAX_BODY_BYTES;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.http.HttpHeaders.ORIGIN;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.TEXT_HTML;
import static org.springframework.http.MediaType.TEXT_PLAIN;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.service.ContactOutcomeLog;
import io.github.milkliz0rd.portfolio.service.ContactService;
import jakarta.servlet.RequestDispatcher;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;

/**
 * The log line of E-02 (PB-05, PB-07): exactly one per POST on its route, with its true issue, and
 * never a value of the request. Every field, the honeypot, the token and the Origin header carry a
 * marked value, which no line of the captured output may show, at the default INFO level.
 */
@WebMvcTest(properties = "contact.allowed-origins=https://www.site.example")
@Import(ContactService.class)
@ExtendWith(OutputCaptureExtension.class)
class ContactOutcomeLogTest {

	private static final String ADDRESS = "marqueur.adresse" + "@" + "exemple.fr";

	private static final Pattern LINE = Pattern.compile("contact-message outcome=.*");

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private MessageSender messageSender;

	/** A body whose every value is marked, with the given properties replaced. */
	private static String marked(Object... replacements) {
		Object[] values = { "lastName", "marqueur-nom", "firstName", "marqueur-prenom", "email", ADDRESS, "subject",
				"marqueur-sujet", "message", "marqueur-message", "website", "", "formToken", "marqueur-jeton" };
		Object[] all = new Object[values.length + replacements.length];
		System.arraycopy(values, 0, all, 0, values.length);
		System.arraycopy(replacements, 0, all, values.length, replacements.length);
		return ContactMessageEndpointTest.body(all);
	}

	private static RequestBuilder e02(String body) {
		return post(ROUTE).header(ORIGIN, ALLOWED).contentType(APPLICATION_JSON).content(body);
	}

	static Stream<Arguments> requests() {
		return Stream.of(arguments(e02(marked()), "INFO", "sent"),
				arguments(post(URI.create(ROUTE + ";x=marqueur")).contentType(APPLICATION_JSON).content(marked()), "INFO",
						"sent"),
				arguments(e02(marked("lastName", "", "email", "marqueur-sans-arobase")), "INFO",
						"validation-refused durationMs=\\d+ fields=lastName:required,email:invalid-email"),
				arguments(e02("{\"lastName\": \"marqueur-nom\","), "INFO", "unreadable-body"),
				arguments(e02(marked("subject", 12, "message", "marqueur")), "INFO", "unreadable-body"),
				arguments(e02(marked("message", "marqueur".repeat(MAX_BODY_BYTES / 8))), "INFO", "unreadable-body"),
				arguments(unannounced(marked("message", "marqueur".repeat(MAX_BODY_BYTES / 8))), "INFO",
						"unreadable-body"),
				arguments(post(ROUTE).header(ORIGIN, ALLOWED).contentType(TEXT_PLAIN).content(marked()), "INFO",
						"unsupported-media-type"),
				arguments(post(ROUTE).accept(TEXT_HTML).contentType(APPLICATION_JSON).content(marked()), "INFO",
						"not-acceptable"),
				arguments(post(ROUTE).header(ORIGIN, "https://marqueur-origine.example")
					.contentType(APPLICATION_JSON)
					.content(marked()), "INFO", "origin-refused"),
				arguments(get("/error").with((request) -> {
					request.setMethod("POST");
					request.setAttribute(ContactOutcomeLog.ARRIVAL, System.nanoTime());
					request.setAttribute(RequestDispatcher.ERROR_STATUS_CODE, 500);
					request.setAttribute(RequestDispatcher.ERROR_REQUEST_URI, ROUTE);
					return request;
				}), "ERROR", "internal-error"));
	}

	@ParameterizedTest
	@MethodSource("requests")
	void aPostOnE02GetsOneLineWithItsIssueAndNoValue(RequestBuilder request, String level, String issue,
			CapturedOutput output) throws Exception {
		this.mockMvc.perform(request);
		assertThat(lines(output)).singleElement()
			.asString()
			.matches(".* " + level + " .* contact-message outcome=" + issue
					+ (issue.contains("durationMs") ? "" : " durationMs=\\d+"));
		assertThat(output.getAll()).doesNotContainIgnoringCase("marqueur");
	}

	@Test
	void anInternalErrorIsWrittenAtErrorWithItsStackTrace(CapturedOutput output) throws Exception {
		willThrow(new IllegalStateException("Test failure")).given(this.messageSender).send(any());
		this.mockMvc.perform(e02(marked()));
		assertThat(lines(output)).singleElement().asString().matches(".* ERROR .* outcome=internal-error durationMs=\\d+");
		assertThat(output.getAll()).contains("java.lang.IllegalStateException: Test failure")
			.doesNotContainIgnoringCase("marqueur");
	}

	static Stream<RequestBuilder> requestsWithoutLine() {
		return Stream.of(preflight(ALLOWED), preflight("https://marqueur-origine.example"),
				get(ROUTE).header(ORIGIN, ALLOWED), post(ROUTE + "/").contentType(APPLICATION_JSON).content(marked()),
				post("/api/v1/missing").header(ORIGIN, "https://marqueur-origine.example"),
				get("/error").requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 500)
					.requestAttr(RequestDispatcher.ERROR_REQUEST_URI, ROUTE));
	}

	/** Preflight requests, other methods and other routes, even refused or failed, write nothing. */
	@ParameterizedTest
	@MethodSource("requestsWithoutLine")
	void anyOtherRequestGetsNoLine(RequestBuilder request, CapturedOutput output) throws Exception {
		this.mockMvc.perform(request);
		assertThat(lines(output)).isEmpty();
		assertThat(output.getAll()).doesNotContainIgnoringCase("marqueur");
	}

	private static List<String> lines(CapturedOutput output) {
		return output.getAll().lines().filter((line) -> LINE.matcher(line).find()).toList();
	}

	/** The body without announced length, as a chunked body would be. */
	private static RequestBuilder unannounced(String body) {
		return (servletContext) -> {
			MockHttpServletRequest request = new MockHttpServletRequest(servletContext, "POST", ROUTE) {
				@Override
				public long getContentLengthLong() {
					return -1;
				}

				@Override
				public int getContentLength() {
					return -1;
				}
			};
			request.setContentType(APPLICATION_JSON_VALUE);
			request.setContent(body.getBytes(StandardCharsets.UTF_8));
			return request;
		};
	}

}
