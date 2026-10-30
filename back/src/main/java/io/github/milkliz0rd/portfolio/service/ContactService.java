package io.github.milkliz0rd.portfolio.service;

import io.github.milkliz0rd.portfolio.sender.ContactMessage;
import io.github.milkliz0rd.portfolio.sender.MessageSender;

import org.springframework.stereotype.Service;

/**
 * The contact service: hands a validated message to the message sender, once. The filter chain
 * against unwanted messages (TK-22) will run here first; until then, every valid message is handed
 * over, whatever its honeypot and its token.
 */
@Service
public class ContactService {

	private final MessageSender messageSender;

	public ContactService(MessageSender messageSender) {
		this.messageSender = messageSender;
	}

	public void send(ContactMessage message) {
		this.messageSender.send(message);
	}

}
