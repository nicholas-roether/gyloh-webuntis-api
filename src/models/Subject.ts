/**
 * Represents a subject or course.
 */
class Subject {
	private static readonly subjectNames: {[key: string]: string} = {
		"D": "Deutsch",
		"De": "Deutsch",
		"E": "Englisch",
		"M": "Mathe",
		"Geo": "Geografie",
		"Phy": "Physik",
		"Ku": "Kunst",
		"Sp": "Sport",
		"Sn": "Spanisch",
		"Fr": "Französisch",
		"Bio": "Biologie",
		"Ch": "Chemie",
		"Gebi": "Geschichte Bilingual",
		"Sem": "Seminar"
		// TODO add rest
	}

	private static readonly courseTypes: {[key: string]: string} = {
		"g": "Grundkurs",
		"L": "Leistungskurs"
	}

	private static get courseRegex() {
		return new RegExp(`^(${Object.keys(this.subjectNames).join("|")})(${Object.keys(this.courseTypes).join("|")})?([0-9]+)?$`)
	}

	private static parseSubject(name: string) {
		const res = this.courseRegex.exec(name);
		if(!res) return name;
		const subjectName = this.subjectNames[res[1]];
		const courseTypeKey = res[2];
		const courseNumber = res[3];
		return `${subjectName}${courseTypeKey ? " " + this.courseTypes[courseTypeKey] : ""}${courseNumber ? " " + courseNumber : ""}`;
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
	 * Examples include `"Chemie"` and `"Deutsch Grundkurs 1"`.
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