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

	public readonly shortName: string;

	public get longName(): string {
		return Subject.parseSubject(this.shortName);
	}

	constructor(name: string) {
		this.shortName = name;
	}
}

export {
	Subject
}