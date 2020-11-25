/**
 * Represents general a message for the day that applies to most students
 */
class Message {
	/**
	 * A specific topic that this message concerns. often just an empty string.
	 */
	public readonly subject: string;
	/**
	 * The content of this message.
	 */
	public readonly body: string;

	/**
	 * @param subject A specific topic that this message concerns
	 * @param body The content of this message
	 */
	constructor(subject: string, body: string) {
		this.subject = subject;
		this.body = body;
	}
}

export {
	Message
}