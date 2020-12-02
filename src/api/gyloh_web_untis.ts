import he from "he";

import { TimeTable } from "../models/TimeTable";
import { Entry } from "../models/Entry";
import { Class } from "../models/Class";
import { Message } from "../models/Message";
import { Room } from "../models/Room";
import { Subject } from "../models/Subject";
import { Substitution } from "../models/Substitution";
import { WebUntis } from "./webuntis";

/**
 * This error occurs if there was a problem parsing the data recieved from UntisWeb.
 * 
 * This probably happened for one of two reasons:
 * 1. WebUntis changed the way data is presented in their API
 * 2. There is a bug in my parsing code that I didn't manage to find
 * 
 * In both cases this API needs to be updated. Please post an issue on GitHub if this error ever gets thrown.
 */
class GylohWebUntisParsingError extends Error {
	constructor(e: any) {
		super(
			"An error occurred parsing the webuntis data: " + e
		);
	}
}

class _GylohWebUntis {
	private formatName = "Vertretung Netz";
	private schoolName = "hh5847";
	private webUntis = new WebUntis();
	
	/** 
	 * Gets a `TimeTable` object asyncronously for a specific day.
	 * 
	 * Returns null if none exists for that day, such as weekends or during holidays.
	 * Might return empty tables when no entries have been made yet.
	 * 
	 * @param day The day of which to get the time table , in the form of a Date or a timestamp.
	 */
	public async getTable(day: Date | number): Promise<TimeTable | null> {
		if(typeof day == "number") day = new Date(day);
		const table = (await this.requestTables(day, 1))[0];
		if(table.date.toDateString() != day.toDateString()) return null;
		return table;
	}
	
	/**
	 * Gets the dates for the currently relevant tables without retrieving table data.
	 * Useful if you only want to know the dates for which tables exist to get them later,
	 * with less overhead.
	 * 
	 * @param num how many dates to get. The default is two.
	 */
	public async getCurrentDates(num: number = 2) : Promise<Date[]> {
		const response = await this.webUntis.getTablesMinimal(this.formatName, this.schoolName, new Date(), num);
		if(response.hasError) throw response.error;
		let dates: Date[] = [];
		for(let payload of response.payloads as any[]) {
			let date = payload.date;
			if(!date) throw new GylohWebUntisParsingError("No date was set");
			try {
				dates.push(this.parseDate(date))
			} catch(e) {
				throw new GylohWebUntisParsingError(e);
			}
		}
		return dates;
	}

	/**
	 * Gets the currently relevant tables; This usually means either today's table or that of the next school day,
	 * plus an arbitrary number of tables in the future.
	 * 
	 * @param num how many tables to get. The default is two.
	 */
	public getCurrentTables(num: number = 2) : Promise<TimeTable[]> {
		return this.requestTables(new Date(), num);
	}

	private async requestTables(day: Date, num: number): Promise<TimeTable[]> {
		const response = await this.webUntis.getSubstitution(
			this.formatName, 
			this.schoolName, 
			day,
			num
		);
		if(response.hasError) throw response.error;
		let tables: TimeTable[] = [];
		for(let payload of response.payloads) {
			let table;
			try {
				table = this.parseTimeTable(payload);
			} catch(e) {
				throw new GylohWebUntisParsingError(e);
			}
			tables.push(table);
		}
		return tables;
	}

	private parseText(str: string): string {
		return he.decode(str);
	}

	private parseDate(dateStr: string): Date {
		dateStr = this.parseText(dateStr);
		const isoStr = [dateStr.substr(0, 4), dateStr.substr(4, 2), dateStr.substr(6, 2)].join("-");
		return new Date(Date.parse(isoStr));
	}

	private parseMessage(data: any): Message {
		return new Message(this.parseText(data.subject), this.parseText(data.body));
	}

	private readonly substitutionRegex = /^<span class="substMonitorSubstElem">(.+)<\/span> \((.+)\)$/

	private isSubstitution(str: string) {
		return this.substitutionRegex.test(str);
	}

	private splitSubstitution(str: string): Substitution<string> {
		const res = this.substitutionRegex.exec(str);
		if(res == null) return {current: str};
		return {
			current: res[1] === "---" ? null : this.parseText(res[1]),
			subst: res[2] === "---" ? null : this.parseText(res[2])
		}
	}

	private parseRooms(str: string): (Room | Substitution<Room>)[] {
		const roomStrs = this.parseText(str).split(", ");
		const rooms = roomStrs.map(str => {
			if(!this.isSubstitution(str)) return new Room(str);
			const strSub = this.splitSubstitution(str);
			let current: Room | undefined;
			let subst: Room | undefined;
			if(strSub.current) current = new Room(strSub.current);
			if(strSub.subst) subst = new Room(strSub.subst);
			return new Substitution(current, subst);
		});
		return rooms;
	}

	private parseTeacher(str: string): (string | Substitution<string>) {
		if(!this.isSubstitution(str)) return str;
		return this.splitSubstitution(str);
	}

	private parseSubject(str: string): Subject {
		return new Subject(this.parseText(str));
	}

	private parseEntry(row: any): Entry {
		return new Entry({
			lesson: this.parseText(row.data[0]),
			time: this.parseText(row.data[1]),
			class: this.parseClass(row.data[2]),
			subject: this.parseSubject(row.data[3]),
			rooms: this.parseRooms(row.data[4]),
			teacher: this.parseTeacher(row.data[5]),
			info: this.parseText(row.data[6]),
			message: this.parseText(row.data[7])
		});
	}

	private parseEntries(rows: any[]) {
		const entries = rows.map(r => this.parseEntry(r));
		const uniqueEntries: Entry[] = [];
		entries.forEach(e => {
			if(!uniqueEntries.some(ue => JSON.stringify(e) === JSON.stringify(ue))) uniqueEntries.push(e)
		});
		return uniqueEntries;
	}

	private parseClass(gString: string) {
		return new Class(this.parseText(gString));
	}

	private parseClasses(gStrings: string[]) {
		return gStrings.map(g => this.parseClass(g));
	}

	private parseMessages(msgStrings: any[]) {
		return msgStrings.map(m => this.parseMessage(m));
	}

	private parseTimeTable(data: any): TimeTable {
		return new TimeTable({
			date: this.parseDate(data.date.toString()),
			lastUpdate: this.parseText(data.lastUpdate),
			affectedClasses: this.parseClasses(data.affectedElements["1"]),
			messages: this.parseMessages(data.messageData.messages),
			entries: this.parseEntries(data.rows)
		});
	}

}

/**
 * The entry point for the gyloh-web-untis API.
 */
const GylohWebUntis = new _GylohWebUntis();

export {
	GylohWebUntis,
	GylohWebUntisParsingError,
}