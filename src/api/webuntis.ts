import Axios from "axios";

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
	public readonly payloads: unknown[];
	public readonly error: Error | null;

	constructor(payloads: unknown[] | null, error: Error | null) {
		this.payloads = payloads || [];
		this.error = error;
	}

	get hasData() {
		return this.payloads.length > 0;
	}

	get hasError() {
		return this.error != null;
	}
}

class WebUntis {
	private static readonly HOST = "ikarus.webuntis.com";
	private static readonly API_BASE = `https://${WebUntis.HOST}/WebUntis/monitor`;

	private parseResponse(data: any): WebUntisResponse {
		let payload: any = null;
		let error: Error | null = null;
		if(!data) error = new WebUntisCommunicationError("WebUntis response was of unexpected");
		else {
			payload = data["payload"];
			const errData = data["error"];
			if(errData) error = new WebUntisError(errData.message, errData.data, errData.code);
		}
		return new WebUntisResponse([payload], error);
	}

	private async untisRequest(apiPath: string, schoolName: string, requestBody: object): Promise<WebUntisResponse> {
		let error;

		const json = JSON.stringify(requestBody);
		const body = await Axios.post(
			WebUntis.API_BASE + `${apiPath}?school=${schoolName}`,
			json,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Content-Length": `${json.length}`,
					"Host": "ikarus.webuntis.com"
				},
			}
		).then((res: any) => res.data).catch((e: any) => error = new WebUntisCommunicationError(e));

		if(error) return new WebUntisResponse(null, error);
		return this.parseResponse(body);
	}

	private formatDate(date: Date): number {
		return Number.parseInt(date.toISOString().split("T")[0].replace(/-/g, ""));
	}

	public async getFormat(formatName: string, schoolName: string) : Promise<WebUntisResponse> {
		return this.untisRequest("substitution/format", schoolName, {
			schoolName,
			formatName
		});
	}

	public async getTicker(formatName: string, schoolName: string, date: Date, numberOfDays: number): Promise<WebUntisResponse> {
		return this.untisRequest("ticker/data", schoolName, {
			schoolName,
			formatName,
			date: this.formatDate(date),
			numberOfDays
		});
	}

	public async getTablesMinimal(
		formatName: string,
		schoolName: string,
		date: Date,
		num: number = 1
	): Promise<WebUntisResponse> {
		let error: Error | null = null;
		let payloads: any[] = [];
		let reqDate = this.formatDate(date);
		for(; num > 0; num--) {
			const response = await this.untisRequest("substitution/data", schoolName, {
				schoolName,
				formatName,
				date: reqDate,
				groupBy: 1,
				hideAbsent: true,
				departmentIds: [],
				departmentElementType: -1,
				hideCalcelWithSubstitution: true,
				showAbsentElements: [],
				showAffectedElements: []
			});
			if(response.hasError) {
				error = response.error;
				break;
			}
			if(!response.hasData) break;
			const payload = response.payloads[0] as any;
			payloads.push(payload);
			if(payload.nextDate === null) break;
			reqDate = payload.nextDate;
		}
		return new WebUntisResponse(payloads, error);
	}

	public async getSubstitution(
		formatName: string,
		schoolName: string,
		date: Date,
		num: number = 1
	): Promise<WebUntisResponse> {
		let error: Error | null = null;
		let payloads: any[] = [];
		let reqDate = this.formatDate(date);
		for(; num > 0; num--) {
			const response = await this.untisRequest("substitution/data", schoolName, {
				schoolName,
				formatName,
				date: reqDate,
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
			});
			if(response.hasError) {
				error = response.error;
				break;
			}
			if(!response.hasData) break;
			const payload = response.payloads[0] as any;
			payloads.push(payload);
			if(payload.nextDate === null) break;
			reqDate = payload.nextDate;
		}
		return new WebUntisResponse(payloads, error);
	}
}

export {
	WebUntis,
	WebUntisResponse,
	WebUntisError,
	WebUntisCommunicationError
}