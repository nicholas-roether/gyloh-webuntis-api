class Entry {
	public readonly lesson: string;
	public readonly time: string;
	public readonly groups: Group[];
	public readonly subject: Subject;
	public readonly room: Room;
	public readonly substRoom?: Room; // The room which is being substituted for, if applicable
	public readonly teacher: string;
	public readonly substTeacher?: string; // The Teacher who is being substituted for, if applicable
	public readonly info: string;
	public readonly message: string;

	constructor(init: Entry) {
		this.lesson = init.lesson;
		this.time = init.time;
		this.groups = init.groups;
		this.subject = init.subject;
		this.room = init.room;
		this.substRoom = init.substRoom;
		this.teacher = init.teacher;
		this.substTeacher = init.substTeacher;
		this.info = init.info;
		this.message = init.message;
	}

	public affects(group: Group): boolean {
		return this.groups.includes(group);
	}
}