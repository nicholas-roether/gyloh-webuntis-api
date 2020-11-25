class Room {
	private static readonly buildingNames: {[key: string]: string} = {
		"F": "Forum",
		"L": "Lichthof",
		"B": ""
	}

	private static readonly roomNames: {[key: string]: string} = {
		"": "Raum",
		"Geo": "Geografieraum",
		"Sp": "Sporthalle",
		"Chem": "Chemieraum",
		"Phy": "Physikraum",
		"Bio": "Biologieraum",
		"Info": "Computerraum",
		"Ku": "Kunst",
		"Rapp": "Rappelkiste",
		// TODO complete
	}

	private static get roomParseRegex(): RegExp {
		return new RegExp(`^(${Object.keys(this.buildingNames).join("|")})(${Object.keys(this.roomNames)})?([0-9]+)?$`)
	}

	private static parseRoom(id: string): string {
		const res = this.roomParseRegex.exec(id);
		if(!res) return id;
		const buildingId = res[1];
		const roomId = res[2];
		const roomNum = res[3];
		const building = this.buildingNames[buildingId];
		const room = roomId ? this.roomNames[roomId] : this.roomNames[""];

		return `${building} ${room}${roomNum ? " " + roomNum : ""}`;
	}

	public readonly shortName: string;
	public readonly longName: string;

	constructor(id: string) {
		this.shortName = id;
		this.longName = Room.parseRoom(id);
	}
}

export {
	Room
}