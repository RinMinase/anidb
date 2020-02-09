import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartsModule } from "@rinminase/ng-charts";

import { LegendModule } from "@components/legend/legend.module";
import { ByNameComponent } from "./by-name.component";

const routes: Routes = [{ path: "", component: ByNameComponent }];

@NgModule({
	declarations: [ByNameComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbCollapseModule,
		ChartsModule,

		LegendModule,
	],
})
export class ByNameModule {}
