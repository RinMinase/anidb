import { NgModule, Component, OnInit } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
	NgbCollapseModule,
	NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@rinminase/ng-fortawesome";

import {
	faCalendarAlt,
	// faCalendarPlus,
	// faChartPie,
	faCloudDownloadAlt,
	// faCode,
	// faCog,
	// faEdit,
	faFileCsv,
	faFileExcel,
	// faFlask,
	faHdd,
	faHome,
	faList,
	faPencilAlt,
	faPlay,
	// faPlus,
	faPowerOff,
	faQuestion,
	faSortAlphaDown,
	faTasks,
} from "@rinminase/ng-fortawesome";

import { DarkModeService } from "@services/dark-mode.service";
import { FirebaseService } from "@services/firebase.service";
import { distinctUntilChanged } from "rxjs/operators";

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
	faCalendarAlt = faCalendarAlt;
	// faCalendarPlus = faCalendarPlus;
	// faChartPie = faChartPie;
	faCloudDownloadAlt = faCloudDownloadAlt;
	// faCode = faCode;
	// faCog = faCog;
	// faEdit = faEdit;
	faFileCsv = faFileCsv;
	faFileExcel = faFileExcel;
	// faFlask = faFlask;
	faHdd = faHdd;
	faHome = faHome;
	faList = faList;
	faPencilAlt = faPencilAlt;
	faPlay = faPlay;
	// faPlus = faPlus;
	faPowerOff = faPowerOff;
	faQuestion = faQuestion;
	faSortAlphaDown = faSortAlphaDown;
	faTasks = faTasks;

	darkModeToggle = new FormControl(false);
	isNavCollapsed: boolean = false;

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
		this.firebase.logout().then(() => this.router.navigateByUrl("/login"));
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
