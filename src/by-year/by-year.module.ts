import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import {
	NgbCollapseModule,
	NgbDropdownModule,
	NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";

import { ByYearComponent } from "./by-year.component";

const routes: Routes = [{ path: "", component: ByYearComponent }];

@NgModule({
	declarations: [ByYearComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbCollapseModule,
		NgbDropdownModule,
		NgbTooltipModule,
		FontAwesomeModule,
	],
})
export class ByYearModule {}
