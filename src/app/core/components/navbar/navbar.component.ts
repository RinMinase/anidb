import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";

import { DarkModeService } from "@services/dark-mode.service";
import { FirebaseService } from "@services/firebase.service";

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {

	darkModeToggle = new FormControl(false);
	isNavCollapsed: boolean = false;

	constructor(
		private router: Router,
		private darkMode: DarkModeService,
		private firebase: FirebaseService,
	) { }

	ngOnInit() {
		this.darkModeToggle.valueChanges.subscribe((value) => {
			(value) ? this.darkMode.enableDarkMode() : this.darkMode.disableDarkMode();
		});
	}

	logout() {
		this.firebase.logout()
			.then(() => this.router.navigateByUrl("/login"));
	}

}
