import { NgModule, Component, Input, OnInit } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
	NgbCollapseModule,
	NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@rinminase/ng-fortawesome";

import {
	fasCalendarAlt,
	// fasCalendarPlus,
	// fasChartPie,
	fasCloudDownloadAlt,
	// fasCode,
	// fasCog,
	// fasEdit,
	fasFileCsv,
	fasFileExcel,
	// fasFlask,
	fasHdd,
	fasHome,
	fasList,
	fasPencilAlt,
	fasPlay,
	// fasPlus,
	fasPowerOff,
	fasQuestion,
	fasSortAlphaDown,
	fasTasks,
} from "@rinminase/ng-fortawesome";

import { DarkModeService } from "@services/dark-mode.service";
import { FirebaseService } from "@services/firebase.service";
import { distinctUntilChanged } from "rxjs/operators";

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
	@Input() isHomeScreen: boolean;

	fasCalendarAlt = fasCalendarAlt;
	// fasCalendarPlus = fasCalendarPlus;
	// fasChartPie = fasChartPie;
	fasCloudDownloadAlt = fasCloudDownloadAlt;
	// fasCode = fasCode;
	// fasCog = fasCog;
	// fasEdit = fasEdit;
	fasFileCsv = fasFileCsv;
	fasFileExcel = fasFileExcel;
	// fasFlask = fasFlask;
	fasHdd = fasHdd;
	fasHome = fasHome;
	fasList = fasList;
	fasPencilAlt = fasPencilAlt;
	fasPlay = fasPlay;
	// fasPlus = fasPlus;
	fasPowerOff = fasPowerOff;
	fasQuestion = fasQuestion;
	fasSortAlphaDown = fasSortAlphaDown;
	fasTasks = fasTasks;

	darkModeToggle = new FormControl(false);
	isNavCollapsed: boolean = false;
	isHome: boolean = false;

	constructor(
		private router: Router,
		private darkMode: DarkModeService,
		private firebase: FirebaseService,
	) {}

	ngOnInit() {
		this.darkModeToggle.valueChanges
			.pipe(distinctUntilChanged())
			.subscribe((value) => {
				value
					? this.darkMode.enableDarkMode()
					: this.darkMode.disableDarkMode();
			});
	}

	logout() {
		this.firebase.logout()
			.then(() => {
				localStorage.removeItem("data");
				localStorage.removeItem("uuid");

				this.router.navigateByUrl("/login")
			});
	}
}

@NgModule({
	declarations: [NavbarComponent],
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		FontAwesomeModule,

		NgbCollapseModule,
		NgbDropdownModule,
	],
	exports: [NavbarComponent],
})
export class NavbarModule {}
