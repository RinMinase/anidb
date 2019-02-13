import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { FirebaseNewService } from "@services/firebase-new.service";

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
	isNavCollapsed: Boolean = false;

	constructor(
		private router: Router,
		private firebase: FirebaseNewService,
	) { }

	ngOnInit() {
	}

	logout() {
		this.firebase.logout()
			.then(() => this.router.navigateByUrl("/login"));
	}
}
