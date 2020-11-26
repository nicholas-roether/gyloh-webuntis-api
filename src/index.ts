import { GylohWebUntis, GylohWebUntisParsingError } from "./api/gyloh_web_untis";
import { WebUntisCommunicationError, WebUntisError } from "./api/webuntis";
import { Entry } from "./models/Entry";
import { Group } from "./models/Group";
import { Message } from "./models/Message";
import { Room } from "./models/Room";
import { Subject } from "./models/Subject";
import { Substitution } from "./models/Substitution";
import { SubstitutionPlan } from "./models/SubstitutionPlan";

export {
	GylohWebUntis,
	Entry,
	Group,
	Message,
	Room,
	Subject,
	Substitution,
	SubstitutionPlan,
	WebUntisError,
	WebUntisCommunicationError,
	GylohWebUntisParsingError
}