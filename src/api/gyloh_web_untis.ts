import he from "he";

import { DayPlan } from "../models/DayPlan";
import { Entry } from "../models/Entry";
import { Group } from "../models/Group";
import { Message } from "../models/Message";
import { Room } from "../models/Room";
import { Subject } from "../models/Subject";
import { Substitution } from "../models/Substitution";
import { WebUntis } from "../webuntis";

class GylohWebUntisParsingError extends Error {
	constructor() {
		super(
			"An error occurred parsing the webuntis data. This is likely due to a problem with this library, or due to it being outdated. " +
			"Try updating the package, and post an issue on github if that doesn't help."
		);
	}
}

class _GylohWebUntis {
	private static formatName = "Vertretung Netz";
	private static schoolName = "hh5847";
	private static webUntis = new WebUntis();

	public async getPlan(day: Date): Promise<DayPlan> {
		const response = await _GylohWebUntis.webUntis.getSubstitution(_GylohWebUntis.formatName, _GylohWebUntis.schoolName, day);
		if(response.hasError) throw response.error;
		const data = response.payload;
		return _GylohWebUntis.parseDayPlan(data);
	}

	private static parseText(str: string): string {
		return he.decode(str);
	}

	private static parseNumber(str: string): number {
		return Number.parseInt(this.parseText(str));
	}

	private static parseDate(dateStr: string): Date {
		dateStr = this.parseText(dateStr);
		const isoStr = [dateStr.substr(0, 4), dateStr.substr(3, 2), dateStr.substr(5, 2)].join("-");
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
			lesson: this.parseNumber(row.data[0]),
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

	private static parseDayPlan(data: any): DayPlan {
		return new DayPlan({
			date: this.parseDate(data.date.toString()),
			lastUpdate: this.parseText(data.lastUpdate),
			affectedGroups: this.parseGroups(data.affectedElements["1"]),
			messages: this.parseMessages(data.messageData.messages),
			entries: this.parseEntries(data.rows)
		});
	}

}

const GylohWebUntis = new _GylohWebUntis();

export {
	GylohWebUntis,
	GylohWebUntisParsingError
}