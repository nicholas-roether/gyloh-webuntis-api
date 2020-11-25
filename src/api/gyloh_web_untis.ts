import he from "he";

import { SubstitutionPlan } from "../models/SubstitutionPlan";
import { Entry } from "../models/Entry";
import { Group } from "../models/Group";
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

/**
 * This error occurs if you try to get the `SubstitutionPlan` for a day for which none exists using `GylohWebUntis.getPlan()`
 */
class GylohWebUntisPlanNotFoundError extends Error {
	/**
	 * The date for which the program attempted to find a plan
	 */
	public readonly date: Date;

	constructor(date: Date) {
		super(`The plan for ${date.toDateString()} does not exist or could not be found.`);
		this.date = date;
	}
}

class _GylohWebUntis {
	private static formatName = "Vertretung Netz";
	private static schoolName = "hh5847";
	private static webUntis = new WebUntis();
	
	/** 
	 * Gets a `SubstitutionPlan` object asyncronously for a certain day.
	 * 
	 * @param day The day of which to get the substitution plan
	 * 
	 * @throws `GylohWebUntisPlanNotFoundError` if no plan is available for the given day.
	 */
	public async getPlan(day: Date): Promise<SubstitutionPlan> {
		const response = await _GylohWebUntis.webUntis.getSubstitution(_GylohWebUntis.formatName, _GylohWebUntis.schoolName, day);
		if(response.hasError) throw response.error;
		const data = response.payload;
		let plan;
		try {
			plan = _GylohWebUntis.parseDayPlan(data);
		} catch(e) {
			throw new GylohWebUntisParsingError(e);
		}
		if(plan.date.toDateString() != day.toDateString()) 
			throw new GylohWebUntisPlanNotFoundError(day);
		return plan;
	}

	private static parseText(str: string): string {
		return he.decode(str);
	}

	private static parseDate(dateStr: string): Date {
		dateStr = this.parseText(dateStr);
		const isoStr = [dateStr.substr(0, 4), dateStr.substr(4, 2), dateStr.substr(6, 2)].join("-");
		return new Date(Date.parse(isoStr));
	}

	private static parseMessage(data: any): Message {
		return new Message(this.parseText(data.subject), this.parseText(data.body));
	}

	// private static readonly substitutionRegex = /^<span class="substMonitorSubstElem">(.+)<\/span> \(<span class="cancelStyle">(.+)<\/span>\)$/
	private static readonly substitutionRegex = /^<span class="substMonitorSubstElem">(.+)<\/span> \((.+)\)$/

	private static isSubstitution(str: string) {
		return this.substitutionRegex.test(str);
	}

	private static splitSubstitution(str: string): Substitution<string> {
		const res = this.substitutionRegex.exec(str);
		if(res == null) return {current: str};
		return {
			current: res[1] === "---" ? null : this.parseText(res[1]),
			subst: res[2] === "---" ? null : this.parseText(res[2])
		}
	}

	private static parseRooms(str: string): (Room | Substitution<Room>)[] {
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

	private static parseTeacher(str: string): (string | Substitution<string>) {
		if(!this.isSubstitution(str)) return str;
		return this.splitSubstitution(str);
	}

	private static parseSubject(str: string): Subject {
		return new Subject(this.parseText(str));
	}

	private static parseEntry(row: any): Entry {
		return new Entry({
			lesson: this.parseText(row.data[0]),
			time: this.parseText(row.data[1]),
			groups: this.parseGroups(row.data[2].split(", ")),
			subject: this.parseSubject(row.data[3]),
			rooms: this.parseRooms(row.data[4]),
			teacher: this.parseTeacher(row.data[5]),
			info: this.parseText(row.data[6]),
			message: this.parseText(row.data[7])
		});
	}

	private static parseEntries(rows: any[]) {
		const entries = rows.map(r => this.parseEntry(r));
		const uniqueEntries: Entry[] = [];
		entries.forEach(e => {
			if(!uniqueEntries.some(ue => JSON.stringify(e) === JSON.stringify(ue))) uniqueEntries.push(e)
		});
		return uniqueEntries;
	}

	private static parseGroups(gStrings: string[]) {
		return gStrings.map(g => new Group(this.parseText(g)));
	}

	private static parseMessages(msgStrings: any[]) {
		return msgStrings.map(m => this.parseMessage(m));
	}

	private static parseDayPlan(data: any): SubstitutionPlan {
		return new SubstitutionPlan({
			date: this.parseDate(data.date.toString()),
			lastUpdate: this.parseText(data.lastUpdate),
			affectedGroups: this.parseGroups(data.affectedElements["1"]),
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
	GylohWebUntisPlanNotFoundError
}