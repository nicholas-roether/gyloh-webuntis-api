import { GylohWebUntis, GylohWebUntisParsingError } from "./api/gyloh_web_untis";
import { WebUntisCommunicationError, WebUntisError } from "./api/webuntis";
import { Entry } from "./models/Entry";
import { Class } from "./models/Class";
import { Message } from "./models/Message";
import { Room } from "./models/Room";
import { Subject } from "./models/Subject";
import { Substitution } from "./models/Substitution";
import { TimeTable } from "./models/TimeTable";

export {
	GylohWebUntis,
	Entry,
	Class,
	Message,
	Room,
	Subject,
	Substitution,
	TimeTable,
	WebUntisError,
	WebUntisCommunicationError,
	GylohWebUntisParsingError
}