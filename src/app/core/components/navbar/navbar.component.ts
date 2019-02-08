import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { FirebaseService } from "../../services/firebase.service";

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
	isNavCollapsed: Boolean = false;

	constructor(
		private router: Router,
		private firebase: FirebaseService,
	) { }

	ngOnInit() {
	}

	logout() {
		this.firebase.logout()
			.then(() => this.router.navigateByUrl("/login"));
	}
}
