import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class HomeService {

	private state = new BehaviorSubject({ search: "", id: null });
	currentState = this.state.asObservable();

	constructor() { }

	changeState(search?: string, id?: number) {
		this.state.next({ search, id });
	}
}
