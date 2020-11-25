import fetch from "node-fetch"
import { RequestInit } from "node-fetch";

class WebUntisCommunicationError extends Error {
	constructor(message: string) {
		super(message);
	}
}

class WebUntisError extends Error {
	public readonly message: string;
	public readonly data: any;
	public readonly code: number;

	constructor(message: string, data: any, code: number) {
		super(`WebUntis encountered an error (${code}): ${message}`);
		this.message = message;
		this.data = data;
		this.code = code;
	}
}

class WebUntisResponse {
	public readonly payload: any | null;
	public readonly error: Error | null;

	constructor(payload: any, error: Error | null) {
		this.payload = payload;
		this.error = error;
	}

	get hasData() {
		return this.payload != null;
	}

	get hasError() {
		return this.error != null;
	}
}

class WebUntis {
	private static readonly API_BASE = "https://stundenplan.hamburg.de/WebUntis/monitor/";

	private requestData(body: object) : RequestInit {
		const json = JSON.stringify(body);
		return {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": `${json.length}`,
			},
			body: json
		}
	}

	private parseResponse(data: any): WebUntisResponse {
		let payload: any = null;
		let error: Error | null = null;
		if(!data) error = new WebUntisCommunicationError("WebUntis response was of unexpected");
		else {
			payload = data["payload"];
			const errData = data["error"];
			if(errData) error = new WebUntisError(errData.message, errData.data, errData.code);
		}
		return new WebUntisResponse(payload, error);
	}

	private async request(apiPath: string, schoolName: string, requestBody: object): Promise<WebUntisResponse> {
		let resBody;

		try {
			resBody = await fetch(
				WebUntis.API_BASE + `${apiPath}?school=${schoolName}`,
				this.requestData(requestBody)
			).then(res => res.json());
		} catch(e) {
			return new WebUntisResponse(null, e);
		}

		return this.parseResponse(resBody);
	}

	private formatDate(date: Date): number {
		return Number.parseInt(date.toISOString().split("T")[0].replace(/-/g, ""));
	}

	public async getFormat(formatName: string, schoolName: string) : Promise<WebUntisResponse> {
		return this.request("substitution/format", schoolName, {
			schoolName,
			formatName
		});
	}

	public async getTicker(formatName: string, schoolName: string, date: Date, numberOfDays: number): Promise<WebUntisResponse> {
		return this.request("ticker/data", schoolName, {
			schoolName,
			formatName,
			date: this.formatDate(date),
			numberOfDays
		});
	}

	public async getSubstitution(formatName: string, schoolName: string, date: Date): Promise<WebUntisResponse> {
		return this.request("substitution/data", schoolName, {
			schoolName,
			formatName,
			date: this.formatDate(date),
			mergeBlocks: true,
			showTeacher: true,
			showClass: true,
			showHour: true,
			showInfo: true,
			showRoom: true,
			showSubject: true,
			groupBy: 1,
			hideAbsent: true,
			departmentIds: [],
			departmentElementType: -1,
			hideCancelWithSubstitution: true,
			showTime: true,
			showSubstText: true,
			showAbsentElements: [],
			showAffectedElements: [1],
			showUnitTime: true,
			showMessages: true,
			showAbsentTeacher: true,
			showCancel: true,
		})
	}
}

export {
	WebUntis,
	WebUntisResponse,
	WebUntisError,
	WebUntisCommunicationError
}