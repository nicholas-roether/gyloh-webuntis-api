class Group {
	private static readonly profiles: {[key: string]: string} = {
		"Nat": "NuT-Profil",
		"Fort": "Biologieprofil",
		"Ku": "Kunstprofil",
		"Le": "Geschichtsprofil",
		"LeD": "Geschichtsprofil",
		"LeE": "History-Profil",
		"Spr": "Sprachen/PGW-Profil",
		"Sp": "Sportprofil"
	}

	private static get profileRegex() {
		return new RegExp(`^(S1\\/2|S3\\/4)_(${Object.keys(this.profiles).join("|")})(?: ([0-9]+))?$`);
	}

	private static parseGroupName(name: string) {
		const res = this.profileRegex.exec(name);
		if(!res) return name;
		const semester = res[1];
		const profile = this.profiles[res[2]];
		const number = res[3]

		return `${semester} ${profile}${number ? " " + number : ""}`;
	}

	public readonly shortName: string;

	public get longName(): string {
		return Group.parseGroupName(this.shortName);
	}

	constructor(name: string) {
		this.shortName = name;
	}
}

export {
	Group
}