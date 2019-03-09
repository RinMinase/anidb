import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { getYear } from "date-fns";

@Injectable({
	providedIn: "root",
})
export class HomeService {

	private state = new BehaviorSubject({ search: "", id: null });
	private titleList = new BehaviorSubject([]);

	currentState = this.state.asObservable();
	currTitleList = this.titleList.asObservable();

	constructor() { }

	changeState(search?: string, id?: number) {
		this.state.next({ search, id });
	}

	changeTitleList(titleList: Array<string>) {
		this.titleList.next(titleList);
	}

	parseDuration(duration: string) {
		const durationParts = duration.split(":");

		if (durationParts.length === 3) {
			const hours = (parseInt(durationParts[0], 10) * 3600);
			const minutes = (parseInt(durationParts[1], 10) * 60);
			const seconds = parseInt(durationParts[2], 10);
			return hours + minutes + seconds;
		} else if (durationParts.length === 2) {
			const minutes = (parseInt(durationParts[0], 10) * 60);
			const seconds = parseInt(durationParts[1], 10);
			return minutes + seconds;
		} else {
			return parseInt(durationParts[0], 10);
		}
	}

	iterateYears(): Array<any> {
		const years = [{ id: "0", label: "" }];
		const limit = 1995;
		const yearToday = getYear(new Date());

		for (let i = yearToday; i >= limit; i--) {
			years.push({
				id: i.toString(),
				label: i.toString(),
			});
		}

		return years;
	}

}
