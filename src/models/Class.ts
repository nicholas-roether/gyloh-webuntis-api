/**
 * Represents classes, but also profiles
 */
class Class {
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

	private static parseClassName(name: string) {
		const res = this.profileRegex.exec(name);
		if(!res) return name;
		const semester = res[1];
		const profile = this.profiles[res[2]];
		const number = res[3]

		return `${semester} ${profile}${number ? " " + number : ""}`;
	}

	/**
	 * A short name that describes the class, but can be pretty cryptic if not familiar.
	 * 
	 * Examples include `"S1/2_LeD 2"`.
	 */
	public readonly shortName: string;

	/**
	 * A long, descriptive name for the class. Might be a bit long for some purposes.
	 * 
	 * Examples include `"S1/2 Geschichtsprofil 2"`.
	 */
	public get longName(): string {
		return Class.parseClassName(this.shortName);
	}

	/**
	 * @param name The short name of the class.
	 * 
	 * @see `Class.shortName`
	 */
	constructor(name: string) {
		this.shortName = name;
	}
}

export {
	Class
}