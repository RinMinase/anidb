import { Injectable } from "@angular/core";
import * as moment from "moment-mini";

@Injectable({
	providedIn: "root",
})
export class UtilityService {

	constructor() { }

	convertFilesize(filesize: any, blankPlaceholder?: string) {
		filesize = parseFloat(filesize);

		if (filesize === 0) {
			return blankPlaceholder || "";
		} else if (filesize < 1073741824) {
			return `${(filesize / 1048576).toFixed(2)} MB`;
		} else {
			return `${(filesize / 1073741824).toFixed(2)} GB`;
		}
	}

	convertDate(date: string, omitSeconds: Boolean = false, format?: string) {
		if (format) { return moment(new Date(date)).format(format); }

		if (!omitSeconds) {
			return moment(new Date(date)).format("MMM DD, YYYY HH:mm:ss");
		} else {
			return moment(new Date(date)).format("MMM DD, YYYY HH:mm");
		}
	}

}
