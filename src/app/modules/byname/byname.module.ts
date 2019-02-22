import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

import { LegendModule } from "@components/legend/legend.module";
import { BynameComponent } from "./byname.component";

const routes: Routes = [{ path: "", component: BynameComponent }];

@NgModule({
	declarations: [BynameComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbCollapseModule,

		LegendModule,
	],
})
export class BynameModule { }
