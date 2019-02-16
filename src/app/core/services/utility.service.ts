import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class UtilityService {

	constructor() { }

	convertFilesize(filesize: any) {
		filesize = parseFloat(filesize);

		if (filesize === 0) {
			return "";
		} else if (filesize < 1073741824) {
			return `${(filesize / 1048576).toFixed(2)} MB`;
		} else {
			return `${(filesize / 1073741824).toFixed(2)} GB`;
		}
	}
}
