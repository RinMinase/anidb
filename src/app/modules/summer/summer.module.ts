import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { LegendModule } from "@components/legend/legend.module";
import { SummerComponent } from "./summer.component";
import { ManageSummerComponent } from "./manage-summer/manage-summer.component";

const routes: Routes = [{
	path: "",
	component: SummerComponent,
	children: [{
		path: "",
		component: ManageSummerComponent,
	}, {
		path: "manage",
		component: ManageSummerComponent,
	}],
}];

@NgModule({
	declarations: [SummerComponent, ManageSummerComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),

		LegendModule,
	],
})
export class SummerModule { }
