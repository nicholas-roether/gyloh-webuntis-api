class Group {
	private static readonly profiles: {[key: string]: string} = {
		"Nat": "NuT-Profil",
		"Fort": "Biologieprofil",
		"Ku": "Kunstprofil",
		"Le": "Geschichtsprofil",
		"LeE": "History-Profil",
		"Spr": "Sprache/PGW-Profil",
		"Sp": "Sportprofil"
	}

	private static get profileRegex() {
		return new RegExp(`^(S1\\/2|S3\\/4)_(${Object.keys(this.profiles).join("|")})$`);
	}

	private static parseGroupName(name: string) {
		const res = this.profileRegex.exec(name);
		if(!res) return name;
		const semester = res[1];
		const profile = res[2];

		return `${semester} ${profile}`;
	}

	public readonly shortName: string;
	public readonly longName: string;

	constructor(name: string) {
		this.shortName = name;
		this.longName = Group.parseGroupName(name);
	}
}