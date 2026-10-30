package io.github.milkliz0rd.portfolio.config;

import io.github.milkliz0rd.portfolio.sender.MessageSender;
import io.github.milkliz0rd.portfolio.sender.NoOpMessageSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Chooses the message sender from {@code CONTACT_MAIL_SENDER} (PB-04): {@code brevo}, its default,
 * or {@code none}, which sends nothing and is announced by a warning at startup. The Brevo adapter
 * does not exist yet (TK-20): until it does, {@code brevo} stops the back from starting, as any
 * other value does, so that a forgotten setting never answers 202 to messages that would not leave.
 * The messages name the variable, never the value received.
 */
@Configuration(proxyBeanMethods = false)
public class MessageSenderConfig {

	private static final Logger LOGGER = LoggerFactory.getLogger(MessageSenderConfig.class);

	@Bean
	MessageSender messageSender(@Value("${contact.mail-sender}") String mailSender) {
		return switch (mailSender) {
			case "none" -> {
				LOGGER.warn("Mail sender: none (CONTACT_MAIL_SENDER): messages are accepted and never sent");
				yield new NoOpMessageSender();
			}
			case "brevo" -> throw new IllegalStateException("CONTACT_MAIL_SENDER is brevo, also its value when unset,"
					+ " but this version has no Brevo adapter yet: set CONTACT_MAIL_SENDER=none to start without"
					+ " sending any message");
			default -> throw new IllegalStateException("CONTACT_MAIL_SENDER must be brevo or none");
		};
	}

}
