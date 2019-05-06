import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import {
	NgbCollapseModule,
	NgbDropdownModule,
	NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";

import { ByyearComponent } from "./byyear.component";

const routes: Routes = [{ path: "", component: ByyearComponent }];

@NgModule({
	declarations: [ByyearComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbCollapseModule,
		NgbDropdownModule,
		NgbTooltipModule,
	],
})
export class ByyearModule { }
