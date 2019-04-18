import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import {
	NgbCollapseModule,
	NgbDropdownModule,
	NgbModalModule,
	NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";

import { DownloadComponent } from "./download.component";
import { AddTitleComponent } from "./add-title/add-title.component";
import { AddSeasonComponent } from "./add-season/add-season.component";
import { ManageDownloadComponent } from "./manage-download/manage-download.component";

const routes: Routes = [{
	path: "",
	component: DownloadComponent,
	children: [{
		path: "",
		component: ManageDownloadComponent,
	}, {
		path: "manage",
		component: ManageDownloadComponent,
	}],
}];

@NgModule({
	declarations: [
		AddSeasonComponent,
		AddTitleComponent,
		DownloadComponent,
		ManageDownloadComponent,
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbCollapseModule,
		NgbDropdownModule,
		NgbModalModule,
		NgbTooltipModule,
	],
	entryComponents: [
		AddSeasonComponent,
		AddTitleComponent,
	],
})
export class DownloadModule { }
