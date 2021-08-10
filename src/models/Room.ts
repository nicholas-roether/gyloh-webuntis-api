/**
 * Represents a physical room in the school that lessons take place in
 */
class Room {
	private static readonly buildingNames: {[key: string]: string} = {
		"F": "Forum",
		"L": "Lichthof",
		"B": "",
		"A": "",
		"N": "",
		"V": ""
	}

	private static readonly roomNames: {[key: string]: string} = {
		"": "",
		"Geo": "Geografieraum",
		"Sp": "Sporthalle",
		"Chem": "Chemieraum",
		"Phy": "Physikraum",
		"Bio": "Biologieraum",
		"Info": "Computerraum",
		"Ku": "Kunstraum",
		"Rapp": "Rappelkiste",
		"Mu": "Musikraum",
		"208/209": "208/209",
		"Büh": "Bühne",
		"GW": "Geschichtswerkstatt"
		// TODO complete
	}

	private static get roomParseRegex(): RegExp {
		return new RegExp(`^(${Object.keys(this.buildingNames).join("|")}) ?(${Object.keys(this.roomNames).join("|")})? ?([0-9]+)?(?:BR(0-9+))?$`)
	}

	private static parseRoom(id: string): string {
		const res = this.roomParseRegex.exec(id);
		if(!res) return id;
		const buildingId = res[1];
		const roomId = res[2];
		const roomNum = res[3];
		const roomArea = res[4];
		const building = this.buildingNames[buildingId];
		const room = roomId ? this.roomNames[roomId] : this.roomNames[""];

		return `${building ? building + " " : ""}${room}${roomNum ? " " + roomNum : ""}${roomArea ? " " + roomArea : ""}`;
	}

	/**
	 * A short name that describes this room. This can be pretty cryptic if not familiar.
	 * 
	 * Examples include `"BSp3"` and `"L101"`.
	 */
	public readonly shortName: string;

	/**
	 * A long, descriptive name for the room. Might be a bit long for some purposes.
	 * 
	 * Examples include `"Sporthalle 3"` and `"Lichhof 101"`.
	 */
	public readonly longName: string;

	/**
	 * @param shortName The short name of the room.
	 * 
	 * @see `Room.shortName`
	 */
	constructor(shortName: string) {
		this.shortName = shortName;
		this.longName = Room.parseRoom(this.shortName);
	}
}

export {
	Room
}