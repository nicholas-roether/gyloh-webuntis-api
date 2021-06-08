/**
 * Represents a subject or course.
 */
class Subject {
	private static readonly subjectNames: {[key: string]: string} = {
		"D": "Deutsch",
		"De": "Deutsch",
		"E": "Englisch",
		"En": "Englisch",
		"M": "Mathe",
		"Ma": "Mathe",
		"Geo": "Geografie",
		"Phy": "Physik",
		"Ph": "Physik",
		"Ku": "Kunst",
		"Sp": "Sport",
		"Sn": "Spanisch",
		"Fr": "Französisch",
		"Bio": "Biologie",
		"Ch": "Chemie",
		"Gebi": "Geschichte Bilingual",
		"Sem": "Seminar",
		"PGW": "PGW",
		"Re": "Religion",
		"Ge": "Geschichte",
		"Bläserkl": "Bläserklasse",
		"Kubi": "Kunst Bilingual",
		"Biobi": "Biologie Bilingual",
		"Thea": "Theater",
		"Toefl": "Toefl",
		"Phil": "Philosophie",
		"BasisK": "Basiskurs",
		"In": "Informatik",
		"Wind": "Gyloh Winds",
		"BigB": "Bigband",
		"Förder": "Förderung",
		"Osp": "Oberstufensport"
		// TODO add rest
	}

	private static readonly courseTypes: {[key: string]: string} = {
		"g": "G",
		"L": "L"
	}

	private static get courseRegex() {
		return new RegExp(`^(${Object.keys(this.subjectNames).join("|")})(${Object.keys(this.courseTypes).join("|")}|(?:S[0-9]))?_?([0-9]+)?P?$`)
	}

	private static parseSubject(name: string) {
		const res = this.courseRegex.exec(name);
		if(!res) return name;
		const subjectName = this.subjectNames[res[1]];
		const courseTypeKey = res[2];
		const courseNumber = res[3];
		const isProfileCourse = name.endsWith("P")
		return `${subjectName + ((courseTypeKey || courseNumber) ? " " : "")}${courseTypeKey ? this.courseTypes[courseTypeKey] : ""}${courseNumber || ""}${isProfileCourse ? " (P)" : ""}`;
	}

	/**
	 * A short name that describes this subject. Might sometimes be a bit ambiguous.
	 * 
	 * Examples include `"Ch"` and `"Deg1"`.
	 */
	public readonly shortName: string;

	/**
	 * A long, descriptive name for the subject. Might be a bit long for some purposes.
	 * 
	 * Examples include `"Chemie"` and `"Deutsch G1"`.
	 */
	public readonly longName: string;

	/**
	 * @param name The short name of the subject.
	 * 
	 * @see `Subject.shortName`
	 */
	constructor(name: string) {
		this.shortName = name;
		this.longName = Subject.parseSubject(this.shortName);
	}
}

export {
	Subject
}