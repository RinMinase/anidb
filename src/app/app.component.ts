import { Component } from "@angular/core";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	title = "anidb";

	constructor(public router: Router) {}

	buttonClick() {
		Swal.fire("Good job!", "You clicked the button!", "success");
	}
}
