class Subject {
	private static readonly subjectNames: {[key: string]: string} = {
		"D": "Deutsch",
		"E": "Englisch",
		"M": "Mathe",
		// TODO add rest
	}

	private static parseSubject(name: string) {
		if(Object.keys(this.subjectNames).includes(name)) return this.subjectNames[name];
		return name;
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