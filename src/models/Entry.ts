import { Class } from "./Class";
import { Room } from "./Room";
import { Subject } from "./Subject";
import { Substitution } from "./Substitution";

/**
 * An object containing initialization properties for an `Entry` object.
 */
export type EntryInit = {
	lesson: string;
	time: string;
	class: Class;
	subject: Subject;
	rooms: (Room | Substitution<Room>)[];
	teacher: string | Substitution<string>;
	info: string;
	message: string;
};

/**
 * Represents one entry in the time table.
 * 
 * One entry might affect multiple classes or courses, as well as multiple lessons.
 */
class Entry {
	/**
	 * Which lesson the entry affects. Might be a single number, or a range like 2 - 3.
	 * 
	 * It is not guaranteed that this always follows the same format.
	 */
	public readonly lesson: string;
	/**
	 * The time (hours and minutes) during which the lessons this entry affects take place.
	 * Just like the lesson, this might also be a range.
	 * 
	 * This is purely for presentational purposes and should not be further processed, as it's format can't be guaranteed.
	 */
	public readonly time: string;
	/**
	 * The class (or profile) that this entry affects
	 */
	public readonly class: Class;
	/**
	 * Which subject is (or is normally) being taught during the lessons that this entry affects
	 */
	public readonly subject: Subject;
	/**
	 * Information about the rooms in which the lessons this entry affects are taught. 
	 * Usually this list contains only one entry. The only time it contains multiple is when one class or course is split between multiple rooms.
	 * 
	 * Entries in this list are either `Room` objects, in which case these lessons take place in their normal room (that being the one provided),
	 * or a `Substitution` object which represents that these lessons take place in a different room than usual.
	 * 
	 * In the latter case the `Substitution` object's `subst` property contains the room that is being substituted for, and the `current` property is the room that
	 * the lessons actually take place in.
	 */
	public readonly rooms: (Room | Substitution<Room>)[]
	/**
	 * Information about which teacher teaches the lessons this entry affects.
	 * 
	 * either A short form of the teachers name as a string, or a `Substitution` object which represents that a substitute teacher teaches this lesson.
	 * In the latter case the `Substitution` object's `subst` property contains the teacher that is being substituted for, and the `current` property is the
	 * substitute teacher that actually teaches this lesson
	 */
	public readonly teacher: string | Substitution<string>;
	/**
	 * A short info text about what this entry represents, such as for example wether is constitues a cancellation (`"Entfall"` or `"Ausfall"`),
	 * or independent working (`"EVA"`), etc.
	 */
	public readonly info: string;
	/**
	 * A message from the teacher that contains additional information, such as wether a task was given for cancelled lesson to do at home and where to find it.
	 * 
	 * Usually fairly short.
	 */
	public readonly message: string;

	constructor(init: EntryInit) {
		this.lesson = init.lesson;
		this.time = init.time;
		this.class = init.class;
		this.subject = init.subject;
		this.rooms = init.rooms;
		this.teacher = init.teacher;
		this.info = init.info;
		this.message = init.message;
	}
}

export {
	Entry
}