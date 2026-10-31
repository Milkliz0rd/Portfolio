package io.github.milkliz0rd.portfolio.sender.brevo;

import java.net.SocketTimeoutException;
import java.net.http.HttpTimeoutException;

import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.SendFailedException;
import io.github.milkliz0rd.portfolio.sender.SendFailedException.Kind;

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
 * No message, text or log of this class shows the key or an address.
 */
public final class BrevoMessageSender implements MessageSender {

	/** The transactional e-mail path, under the base address. */
	static final String SEND_PATH = "/smtp/email";

	/** The header that carries the key, as Brevo names it. */
	static final String API_KEY_HEADER = "api-key";

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
	public BrevoMessageSender(RestClient.Builder client, String apiKey, String mailFrom, String mailTo) {
		this.restClient = client.build();
		this.apiKey = apiKey;
		this.mailFrom = mailFrom;
		this.mailTo = mailTo;
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
