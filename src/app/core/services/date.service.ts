import { Injectable } from "@angular/core";
import { getTime } from "date-fns";

@Injectable({
	providedIn: "root",
})
export class DateService {

	constructor() { }

	getUnix(date?: Date): number {
		return (date) ? Math.floor(getTime(date) / 1000) : Math.floor(getTime(new Date) / 1000);
	}

}
