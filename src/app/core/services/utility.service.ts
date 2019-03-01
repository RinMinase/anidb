import { Injectable } from "@angular/core";
import * as moment from "moment-mini";

@Injectable({
	providedIn: "root",
})
export class UtilityService {

	constructor() { }

	autofillYear(date: string) {
		if (date.split(" ").length === 2) {
			const monthRaw: any = parseInt(date.split(" ")[0], 10) || date.split(" ")[0];
			const day = parseInt(date.split(" ")[1], 10) || date.split(" ")[1];
			let month: any;

			if (isNaN(monthRaw)) {
				month = parseInt(moment(monthRaw, "MMM").format("MM"), 10);
			} else {
				month = parseInt(moment(monthRaw, "MM").format("MM"), 10);
			}

			const yearToday = moment().year();
			const dateParsed = `${month} ${day} ${yearToday}`;
			const dateParsedUnix = moment(dateParsed, "MM D YYYY").unix();
			const dateTodayUnix = moment().unix();

			if (dateParsedUnix > dateTodayUnix) {
				date += ` ${(moment().year() - 1).toString()}`;
			} else {
				date += ` ${(moment().year()).toString()}`;
			}
		}

		if ((new Date(date)).toString().indexOf("Invalid Date") === 0) {
			return moment().unix();
		} else {
			return moment(new Date(date)).unix();
		}
	}

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

	convertDate(date: string, omitSeconds: boolean = false, format?: string) {
		if (format) { return moment(new Date(date)).format(format); }

		if (!omitSeconds) {
			return moment(new Date(date)).format("MMM DD, YYYY HH:mm:ss");
		} else {
			return moment(new Date(date)).format("MMM DD, YYYY HH:mm");
		}
	}

	sortByDateThenTitle(a: any, b: any) {
		const aDate = a.rewatchLast || a.dateFinished;
		const bDate = b.rewatchLast || b.dateFinished;

		if (aDate < bDate) {
			return 1;
		} else if (aDate > bDate) {
			return -1;
		}

		if (a.title < b.title) {
			return -1;
		} else if (a.title > b.title) {
			return 1;
		}

		return 0;
	}

	sortByTitle(a: any, b: any) {
		if (a.title < b.title) {
			return -1;
		} else if (a.title > b.title) {
			return 1;
		}
	}



}
