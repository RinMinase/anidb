import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

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
	],
})
export class HddModule { }
