import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { LastwatchComponent } from "./lastwatch.component";
import { LegendModule } from "@components/legend/legend.module";

const routes: Routes = [{ path: "", component: LastwatchComponent }];

@NgModule({
	declarations: [LastwatchComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),

		LegendModule,
	],
})
export class LastwatchModule { }
