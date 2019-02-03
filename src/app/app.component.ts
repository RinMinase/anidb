import { Component } from "@angular/core";
import { Router } from "@angular/router";

import Swal from "sweetalert2";
import * as firebase from "firebase/app";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	constructor(public router: Router) {
		const firebaseConfig = {
			apiKey: "AIzaSyCVsm1c-nS9qS1fFfFo6JCAb908AfPU6Ag",
			authDomain: "rin-anidb.firebaseapp.com",
			databaseURL: "https://rin-anidb.firebaseio.com",
			projectId: "rin-anidb",
			storageBucket: "rin-anidb.appspot.com",
			messagingSenderId: "669722574117",
		};

		firebase.initializeApp(firebaseConfig);
	}

	buttonClick() {
		Swal.fire("Good job!", "You clicked the button!", "success");
	}
}
