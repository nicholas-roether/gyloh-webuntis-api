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

	private static parseDate(dateStr: string): Date {
		const isoStr = [dateStr.substr(0, 4), dateStr.substr(3, 2), dateStr.substr(5, 2)].join("-");
		return new Date(Date.parse(isoStr));
	}

	private static parseMessage(data: any): Message {
		return new Message(data.subject, data.body);
	}

	private static readonly substitutionRegex = /^<span class="substMonitorSubstElem">(.+)<\/span> \(<span class="cancelStyle">(.+)<\/span>\)$/

	private static isSubstitution(str: string) {
		return this.substitutionRegex.test(str);
	}

	private static splitSubstitution(str: string): Substitution<string> {
		const res = this.substitutionRegex.exec(str);
		if(res == null) return {current: str};
		return {
			current: res[1],
			subst: res[2]
		}
	}

	private static parseRooms(str: string): (Room | Substitution<Room>)[] {
		const roomStrs = str.split(", ");
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

	private static parseEntry(row: any): Entry {
		return new Entry({
			lesson: row.data[0],
			time: row.data[1],
			groups: row.data[2].split(", "),
			subject: new Subject(row.data[3]),
			rooms: this.parseRooms(row.data[4]),
			teacher: this.parseTeacher(row.data[5]),
			info: row.data[6],
			message: row.data[7]
		});
	}

	private static parseEntries(rows: any[]) {
		const entries = rows.map(r => this.parseEntry(r));
		const uniqueEntries = entries.filter((e, i) => entries.indexOf(e) == i);
		return uniqueEntries;
	}

	private static parseDayPlan(data: any): DayPlan {
		return new DayPlan({
			date: this.parseDate(data.date.toString()),
			lastUpdate: new Date(Date.parse(data.lastUpdate)),
			affectedGroups: Array.from(data.affectedElements["1"]).map(g => new Group(g as string)),
			messages: Array.from(data.messageData.messages).map(m => this.parseMessage(m)),
			entries: this.parseEntries(Array.from(data.rows))
		});
	}

}

const GylohWebUntis = new _GylohWebUntis();

export {
	GylohWebUntis,
	GylohWebUntisParsingError
}