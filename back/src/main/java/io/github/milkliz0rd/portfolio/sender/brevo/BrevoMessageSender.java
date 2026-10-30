package io.github.milkliz0rd.portfolio.sender.brevo;

import java.net.SocketTimeoutException;
import java.net.http.HttpTimeoutException;
import java.util.regex.Pattern;

import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.SendFailedException;
import io.github.milkliz0rd.portfolio.sender.SendFailedException.Kind;
import io.github.milkliz0rd.portfolio.validation.EmailSyntax;
import org.jspecify.annotations.Nullable;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

/**
 * The Brevo adapter (Étape 7): a {@code POST} on the transactional e-mail path of Brevo's API,
 * authenticated by the {@code api-key} header, from {@code CONTACT_MAIL_FROM} to
 * {@code CONTACT_MAIL_TO} alone; the visitor's address is only the reply-to address, the back never
 * writes to it (CT-07). Any 2xx answer is a success. Any other answer, of which only the code is read,
 * or a network error is a failure; no answer within the time limit, a timeout. Nothing is retried.
 * The key and the two addresses are checked here, at startup, rather than by the validation of the
 * properties, whose failure report shows the value; no message, text or log of this class shows them.
 * Final, since its constructor refuses a wrong setting.
 */
public final class BrevoMessageSender implements MessageSender {

	/** The transactional e-mail path, under the base address. */
	static final String SEND_PATH = "/smtp/email";

	/** The header that carries the key, as Brevo names it. */
	static final String API_KEY_HEADER = "api-key";

	/** Visible ASCII, without space: what an HTTP header can carry as it is. */
	private static final Pattern KEY = Pattern.compile("[\\x21-\\x7E]+");

	private final RestClient restClient;

	private final String apiKey;

	private final String mailFrom;

	private final String mailTo;

	/**
	 * @param client the builder of the client, from BrevoRestClientFactory, which a test binds to its
	 * simulated server first
	 * @param apiKey {@code CONTACT_BREVO_API_KEY}
	 * @param mailFrom {@code CONTACT_MAIL_FROM}
	 * @param mailTo {@code CONTACT_MAIL_TO}
	 */
	public BrevoMessageSender(RestClient.Builder client, @Nullable String apiKey, @Nullable String mailFrom,
			@Nullable String mailTo) {
		if (apiKey == null || apiKey.isBlank()) {
			throw new IllegalStateException("CONTACT_BREVO_API_KEY is missing: set the key of Brevo's API, or"
					+ " CONTACT_MAIL_SENDER=none to start without sending any message");
		}
		if (!KEY.matcher(apiKey).matches()) {
			throw new IllegalStateException("CONTACT_BREVO_API_KEY must be made of visible ASCII characters, without"
					+ " space");
		}
		this.restClient = client.build();
		this.apiKey = apiKey;
		this.mailFrom = checkAddress("CONTACT_MAIL_FROM", "the sending address, on the site's domain", mailFrom);
		this.mailTo = checkAddress("CONTACT_MAIL_TO", "the receiving address", mailTo);
	}

	private static String checkAddress(String variable, String role, @Nullable String address) {
		if (address == null || address.isBlank()) {
			throw new IllegalStateException(variable + " is missing: set " + role);
		}
		if (!EmailSyntax.isValid(address)) {
			throw new IllegalStateException(variable + " is not a valid e-mail address");
		}
		return address;
	}

	@Override
	public void send(ContactMessage message) {
		HttpStatusCode status;
		try {
			status = this.restClient.post()
				.uri(SEND_PATH)
				.header(API_KEY_HEADER, this.apiKey)
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON)
				.body(BrevoEmailRequest.of(message, this.mailFrom, this.mailTo))
				// The code of the answer, and only it: its body, which may quote an address, is never read.
				.exchangeForRequiredValue((request, response) -> response.getStatusCode());
		}
		catch (ResourceAccessException ex) {
			throw new SendFailedException(isTimeout(ex) ? Kind.TIMEOUT : Kind.FAILURE, null);
		}
		if (!status.is2xxSuccessful()) {
			throw new SendFailedException(Kind.FAILURE, status.value());
		}
	}

	/** Whether the input-output error is the time limit, of the connection or of the answer. */
	private static boolean isTimeout(Throwable failure) {
		for (Throwable cause = failure; cause != null; cause = cause.getCause()) {
			if (cause instanceof HttpTimeoutException || cause instanceof SocketTimeoutException) {
				return true;
			}
		}
		return false;
	}

	@Override
	public String toString() {
		return "BrevoMessageSender[key and addresses hidden]";
	}

}
