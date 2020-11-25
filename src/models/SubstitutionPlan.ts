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

/**
 * Represents the substitution plan for one whole day.
 * 
 * Contains all the entries corresponding to that day.
 */
class SubstitutionPlan {
	/**
	 * The date that this plan corresponds to
	 */
	public readonly date: Date;
	/**
	 * The time this plan was last updated.
	 * 
	 * Not in a standardized format, purely for presentational purposes.
	 */
	public readonly lastUpdate: string;
	/**
	 * A list of `Group`-objects that are affected by this plan.
	 */
	public readonly affectedGroups: Group[];
	/**
	 * The messages of the day that this plan corresponds to.
	 */
	public readonly messages: Message[];
	/**
	 * The entries for the day this plan corresponds to
	 */
	public readonly entries: Entry[];

	constructor(init: SubstitutionPlanInit) {
		this.date = init.date;
		this.lastUpdate = init.lastUpdate;
		this.affectedGroups = init.affectedGroups;
		this.messages = init.messages;
		this.entries = init.entries;
	}

	/**
	 * Checks if a given group is affected by this plan.
	 * 
	 * @param group the `Group`-object to check.
	 */
	public isAffected(group: Group): boolean {
		return this.affectedGroups.includes(group);
	}

	/**
	 * Gets all entries in this plan that affect a given group.
	 * 
	 * @param group the group for which to provide entries.
	 */
	public entriesFor(group: Group): Entry[] {
		if(!this.isAffected(group)) return [];
		return this.entries.filter(e => e.affects(group));
	}
}

export {
	SubstitutionPlan,
}