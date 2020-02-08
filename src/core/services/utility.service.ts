import { Injectable } from "@angular/core";
import { format, getTime, getYear, parse } from "date-fns";

@Injectable({
	providedIn: "root",
})
export class UtilityService {
	constructor() {}

	autofillYear(date: string) {
		if (date.split(" ").length === 2) {
			const monthRaw: any = parseInt(date.split(" ")[0]) || date.split(" ")[0];
			const day = date.split(" ")[1];
			const month = isNaN(monthRaw) ? this.getMonthByName(monthRaw) : monthRaw;

			const yearToday = getYear(new Date());
			const dateParsed = `${month}-${day}-${yearToday}`;
			const dateParsedUnix = this.getUnix(
				parse(dateParsed, "MM-dd-yyyy", new Date()),
			);
			const dateTodayUnix = this.getUnix();

			if (dateParsedUnix > dateTodayUnix) {
				date += ` ${(yearToday - 1).toString()}`;
			} else {
				date += ` ${yearToday.toString()}`;
			}
		}

		if (new Date(date).toString().indexOf("Invalid Date") === 0) {
			return this.getUnix();
		} else {
			return this.getUnix(new Date(date));
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

	convertDate(date: string, omitSeconds: boolean = false, dateFormat?: string) {
		if (dateFormat) {
			return format(new Date(date), dateFormat);
		}

		if (!omitSeconds) {
			return format(new Date(date), "MMM dd, yyyy HH:mm:ss");
		} else {
			return format(new Date(date), "MMM dd, yyyy HH:mm");
		}
	}

	getUnix(date?: Date): number {
		return date
			? Math.floor(getTime(date) / 1000)
			: Math.floor(getTime(new Date()) / 1000);
	}

	sortByDateThenTitle(a: any, b: any) {
		const aDate = a.rewatchLast || a.dateFinished;
		const bDate = b.rewatchLast || b.dateFinished;

		if (aDate > bDate) {
			return -1;
		}
		if (aDate < bDate) {
			return 1;
		}

		if (a.title < b.title) {
			return -1;
		}
		if (a.title > b.title) {
			return 1;
		}

		return 0;
	}

	sortByDateStringThenTitle(a: any, b: any) {
		const aDate = getTime(new Date(a.dateFinished));
		const bDate = getTime(new Date(b.dateFinished));

		if (aDate < bDate) {
			return 1;
		}
		if (aDate > bDate) {
			return -1;
		}

		if (a.title < b.title) {
			return -1;
		}
		if (a.title > b.title) {
			return 1;
		}

		return 0;
	}

	sortByQualityThenTitle(a: any, b: any) {
		if (a.quality < b.quality) {
			return -1;
		}
		if (a.quality > b.quality) {
			return 1;
		}

		if (a.title < b.title) {
			return -1;
		}
		if (a.title > b.title) {
			return 1;
		}

		return 0;
	}

	sortByTitle(a: any, b: any) {
		if (a.title < b.title) {
			return -1;
		}
		if (a.title > b.title) {
			return 1;
		}
		return 0;
	}

	private getMonthByName(month: string): number {
		switch (month.toLowerCase()) {
			case "jan":
				return 1;
			case "feb":
				return 2;
			case "mar":
				return 3;
			case "apr":
				return 4;
			case "may":
				return 5;
			case "june":
				return 6;
			case "jul":
				return 7;
			case "aug":
				return 8;
			case "sep":
			case "sept":
				return 9;
			case "oct":
				return 10;
			case "nov":
				return 11;
			case "dec":
				return 12;
			default:
				return 1;
		}
	}
}
