import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class DarkModeService {
	private state = new BehaviorSubject(false);
	currentState = this.state.asObservable();

	constructor() {}

	enableDarkMode() {
		this.state.next(true);
	}

	disableDarkMode() {
		this.state.next(false);
	}
}
