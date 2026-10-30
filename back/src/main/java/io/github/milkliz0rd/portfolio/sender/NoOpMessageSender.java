package io.github.milkliz0rd.portfolio.sender;

/**
 * The development adapter, chosen by {@code CONTACT_MAIL_SENDER=none}: it accepts every message and
 * sends nothing, nowhere.
 */
public class NoOpMessageSender implements MessageSender {

	@Override
	public void send(ContactMessage message) {
		// Nothing leaves the back.
	}

}
