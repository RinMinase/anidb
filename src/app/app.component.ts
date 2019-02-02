import { Component } from "@angular/core";
import Swal from "sweetalert2";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	title = "anidb";

	buttonClick() {
		Swal.fire("Good job!", "You clicked the button!", "success");
	}
}
