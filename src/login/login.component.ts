import { Component, OnInit, Renderer2 } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { FirebaseService } from "@services/firebase.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

	loading = false;
	alert: string = null;
	loginForm: FormGroup;
	// isFireApp: boolean = false;
	// isNowApp: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		// private platform: PlatformLocation,
		private renderer: Renderer2,
		private router: Router,
		private firebase: FirebaseService,
	) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: ["", Validators.required],
			password: ["", Validators.required],
		});

		// if (this.platform.hostname.includes("firebase")) {
		// 	this.isFireApp = true;
		// } else if (this.platform.hostname.includes("now")) {
		// 	this.isNowApp = true;
		// }
	}

	authenticate() {
		this.loading = true;

		if (this.loginForm.invalid) {
			this.loading = false;
			return;
		}

		const { email, password } = this.loginForm.controls;
		this.firebase.login(email.value, password.value)
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
		this.renderer.addClass(event.target.parentNode, "focused");
	}

	rerenderInputBlur(event: any) {
		if (!event.target.value) {
			this.renderer.removeClass(event.target, "filled");
			this.renderer.removeClass(event.target.parentNode, "focused");
		} else {
			this.renderer.addClass(event.target, "focused");
		}
	}
}
