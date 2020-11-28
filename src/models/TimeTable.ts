import { Entry } from "./Entry";
import { Class } from "./Class";
import { Message } from "./Message";

export type TimeTableInit = {
	date: Date;
	lastUpdate: string;
	affectedClasses: Class[];
	messages: Message[];
	entries: Entry[];
};

/**
 * Represents the time table for one whole day.
 * 
 * Contains all the entries corresponding to that day.
 */
class TimeTable {
	/**
	 * The date that this table corresponds to
	 */
	public readonly date: Date;
	/**
	 * The time this table was last updated.
	 * 
	 * Not in a standardized format, purely for presentational purposes.
	 */
	public readonly lastUpdate: string;
	/**
	 * A list of classes that are affected by this table.
	 */
	public readonly affectedClasses: Class[];
	/**
	 * The messages for the day that this table corresponds to.
	 */
	public readonly messages: Message[];
	/**
	 * The entries in this time table
	 */
	public readonly entries: Entry[];

	constructor(init: TimeTableInit) {
		this.date = init.date;
		this.lastUpdate = init.lastUpdate;
		this.affectedClasses = init.affectedClasses;
		this.messages = init.messages;
		this.entries = init.entries;
	}
}

export {
	TimeTable,
}