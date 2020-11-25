class DayPlan {
	public readonly date: Date;
	public readonly lastUpdate: Date;
	public readonly affectedGroups: Group[];
	public readonly messages: Message[];
	public readonly entries: Entry[];

	constructor(init: DayPlan) {
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