import { Component, OnInit, Renderer } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";

import { FirebaseNewService } from "@services/firebase-new.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

	loading = false;
	alert: string = null;
	email = new FormControl("");
	password = new FormControl("");

	constructor(
		private renderer: Renderer,
		private firebase: FirebaseNewService,
		private router: Router,
	) { }

	ngOnInit() { }

	authenticate() {
		this.loading = true;

		this.firebase.login(this.email.value, this.password.value)
			.then(() => this.router.navigateByUrl("/"))
			.catch((error) => {
				this.loading = false;

				switch (error.code) {
					case "auth/invalid-email":
					case "auth/user-not-found":
					case "auth/argument-error":
					case "auth/wrong-password":
						this.alert = "Invalid username or password.";
						break;
					default:
						this.alert = "An unkown error has occurred.";
				}
			});
	}

	rerenderInputFocus(event: any) {
		this.renderer.setElementClass(event.target.parentNode, "focused", true);
	}

	rerenderInputBlur(event: any) {
		if (!event.target.value) {
			this.renderer.setElementClass(event.target, "filled", false);
			this.renderer.setElementClass(event.target.parentNode, "focused", false);
		} else {
			this.renderer.setElementClass(event.target, "focused", true);
		}
	}
}
