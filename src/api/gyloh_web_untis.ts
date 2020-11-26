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

class _GylohWebUntis {
	private formatName = "Vertretung Netz";
	private schoolName = "hh5847";
	private webUntis = new WebUntis();
	
	/** 
	 * Gets a `SubstitutionPlan` object asyncronously for a specific day.
	 * 
	 * Returns null if none exists for that day, such as weekends or during holidays.
	 * Might return empty tables when no entries have been made yet.
	 * 
	 * @param day The day of which to get the substitution plan, in the form of a Date or a timestamp.
	 */
	public async getPlan(day: Date | number): Promise<SubstitutionPlan | null> {
		if(typeof day == "number") day = new Date(day);
		const plan = (await this.requestPlans(day, 1))[0];
		if(plan.date.toDateString() != day.toDateString()) return null;
		return plan;
	}

	/**
	 * Gets the currently relevant plans; This usually means either today's plan or the plan of the next school day,
	 * plus an arbitrary number of plans in the future.
	 * 
	 * @param num how many plans to get. The default is two.
	 */
	public getCurrentPlans(num: number = 2) : Promise<SubstitutionPlan[]> {
		return this.requestPlans(new Date(), num);
	}

	private async requestPlans(day: Date, num: number): Promise<SubstitutionPlan[]> {
		const response = await this.webUntis.getSubstitution(
			this.formatName, 
			this.schoolName, 
			day,
			num
		);
		if(response.hasError) throw response.error;
		let plans: SubstitutionPlan[] = [];
		for(let payload of response.payloads) {
			let plan;
			try {
				plan = this.parseDayPlan(payload);
			} catch(e) {
				throw new GylohWebUntisParsingError(e);
			}
			plans.push(plan);
		}
		return plans;
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

	// private readonly substitutionRegex = /^<span class="substMonitorSubstElem">(.+)<\/span> \(<span class="cancelStyle">(.+)<\/span>\)$/
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
			groups: this.parseGroups(row.data[2].split(", ")),
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

	private parseGroups(gStrings: string[]) {
		return gStrings.map(g => new Group(this.parseText(g)));
	}

	private parseMessages(msgStrings: any[]) {
		return msgStrings.map(m => this.parseMessage(m));
	}

	private parseDayPlan(data: any): SubstitutionPlan {
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
}