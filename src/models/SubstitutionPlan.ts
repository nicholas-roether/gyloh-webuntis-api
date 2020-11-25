import { Entry } from "./Entry";
import { Group } from "./Group";
import { Message } from "./Message";

type SubstitutionPlanInit = {
	date: Date;
	lastUpdate: string;
	affectedGroups: Group[];
	messages: Message[];
	entries: Entry[];
};

class SubstitutionPlan {
	public readonly date: Date;
	public readonly lastUpdate: string;
	public readonly affectedGroups: Group[];
	public readonly messages: Message[];
	public readonly entries: Entry[];

	constructor(init: SubstitutionPlanInit) {
		this.date = init.date;
		this.lastUpdate = init.lastUpdate;
		this.affectedGroups = init.affectedGroups;
		this.messages = init.messages;
		this.entries = init.entries;
	}

	public isAffected(group: Group): boolean {
		return this.affectedGroups.includes(group);
	}

	public entriesFor(group: Group): Entry[] {
		if(!this.isAffected(group)) return [];
		return this.entries.filter(e => e.affects(group));
	}
}

export {
	SubstitutionPlan,
}