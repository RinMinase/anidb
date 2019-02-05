import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-child",
	template: "<p>child works</p><router-outlet></router-outlet>",
})
export class ChildComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

}
