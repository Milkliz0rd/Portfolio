package io.github.milkliz0rd.portfolio.config;

import java.net.URI;

import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.NoOpMessageSender;
import io.github.milkliz0rd.portfolio.sender.brevo.BrevoMessageSender;
import io.github.milkliz0rd.portfolio.sender.brevo.BrevoRestClientFactory;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Chooses the message sender from {@code CONTACT_MAIL_SENDER} (PB-04): {@code brevo}, its default,
 * built from {@code CONTACT_BREVO_API_KEY}, {@code CONTACT_MAIL_FROM} and {@code CONTACT_MAIL_TO},
 * which it requires, so that a forgotten setting stops the back from starting instead of answering
 * 202 to messages that would not leave; or {@code none}, which sends nothing and is announced by a
 * warning at startup. The messages name the variable, never the value received.
 */
@Configuration(proxyBeanMethods = false)
public class MessageSenderConfig {

	private static final Logger LOGGER = LoggerFactory.getLogger(MessageSenderConfig.class);

	@Bean
	MessageSender messageSender(@Value("${contact.mail-sender}") String mailSender, ContactProperties properties,
			@Value("${contact.brevo-api-key:}") @Nullable String apiKey,
			@Value("${contact.mail-from:}") @Nullable String mailFrom,
			@Value("${contact.mail-to:}") @Nullable String mailTo) {
		return switch (mailSender) {
			case "brevo" -> {
				MessageSender sender = new BrevoMessageSender(
						BrevoRestClientFactory.builder(URI.create(properties.brevoBaseUrl()), properties.providerTimeout()),
						apiKey, mailFrom, mailTo);
				LOGGER.info("Mail sender: brevo (CONTACT_MAIL_SENDER)");
				yield sender;
			}
			case "none" -> {
				LOGGER.warn("Mail sender: none (CONTACT_MAIL_SENDER): messages are accepted and never sent");
				yield new NoOpMessageSender();
			}
			default -> throw new IllegalStateException("CONTACT_MAIL_SENDER must be brevo or none");
		};
	}

}
