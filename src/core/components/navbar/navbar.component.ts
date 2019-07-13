import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";

import { DarkModeService } from "@services/dark-mode.service";
import { FirebaseService } from "@services/firebase.service";
import { distinctUntilChanged } from "rxjs/operators";

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
		this.darkModeToggle.valueChanges
			.pipe(distinctUntilChanged())
			.subscribe((value) => {
				(value) ? this.darkMode.enableDarkMode() : this.darkMode.disableDarkMode();
			});
	}

	logout() {
		this.firebase.logout()
			.then(() => this.router.navigateByUrl("/login"));
	}

}
