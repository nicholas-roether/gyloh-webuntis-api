import { GylohWebUntis, GylohWebUntisParsingError } from "./api/gyloh_web_untis";
import { WebUntisCommunicationError, WebUntisError } from "./api/webuntis";
import { Entry, EntryInit } from "./models/Entry";
import { Class } from "./models/Class";
import { Message } from "./models/Message";
import { Room } from "./models/Room";
import { Subject } from "./models/Subject";
import { Substitution } from "./models/Substitution";
import { TimeTable, TimeTableInit } from "./models/TimeTable";

export {
	GylohWebUntis,
	Entry,
	EntryInit,
	Class,
	Message,
	Room,
	Subject,
	Substitution,
	TimeTable,
	TimeTableInit,
	WebUntisError,
	WebUntisCommunicationError,
	GylohWebUntisParsingError
}