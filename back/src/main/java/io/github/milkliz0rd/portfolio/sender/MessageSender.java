package io.github.milkliz0rd.portfolio.sender;

/**
 * The message sender of the technical design (section 4): the back hands a validated message to
 * an adapter, one per provider; changing provider touches only the adapter and its variables.
 */
public interface MessageSender {

	/**
	 * Hands the message to the provider and returns once the provider has accepted it; nothing is
	 * stored, nothing is retried.
	 * @param message the five fields of a validated message
	 * @throws SendFailedException if the provider failed or exceeded its time limit
	 */
	void send(ContactMessage message);

}
