import { Group } from "./Group";
import { Room } from "./Room";
import { Subject } from "./Subject";
import { Substitution } from "./Substitution";

type EntryInit = {
	lesson: number;
	time: string;
	groups: Group[];
	readonly subject: Subject;
	rooms: (Room | Substitution<Room>)[];
	substRoom?: Room;
	teacher: string | Substitution<string>;
	substTeacher?: string;
	info: string;
	message: string;
};

class Entry {
	public readonly lesson: number;
	public readonly time: string;
	public readonly groups: Group[];
	public readonly subject: Subject;
	public readonly rooms: (Room | Substitution<Room>)[]
	public readonly teacher: string | Substitution<string>;
	public readonly info: string;
	public readonly message: string;

	constructor(init: EntryInit) {
		this.lesson = init.lesson;
		this.time = init.time;
		this.groups = init.groups;
		this.subject = init.subject;
		this.rooms = init.rooms;
		this.teacher = init.teacher;
		this.info = init.info;
		this.message = init.message;
	}

	public affects(group: Group): boolean {
		return this.groups.includes(group);
	}
}

export {
	Entry,
	EntryInit
}