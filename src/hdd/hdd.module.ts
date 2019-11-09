import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { NgbProgressbarModule, NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

import { LegendModule } from "@components/legend/legend.module";
import { HddComponent } from "./hdd.component";
import { ManageHddComponent } from "./manage-hdd/manage-hdd.component";

const routes: Routes = [{
	path: "",
	component: HddComponent,
	children: [{
		path: "",
		component: ManageHddComponent,
	}, {
		path: "manage",
		component: ManageHddComponent,
	}],
}];

@NgModule({
	declarations: [HddComponent, ManageHddComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbProgressbarModule,
		NgbCollapseModule,

		LegendModule,
	],
})
export class HddModule { }
