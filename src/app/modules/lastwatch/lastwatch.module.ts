import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { LastwatchComponent } from "./lastwatch.component";

const routes: Routes = [{ path: "", component: LastwatchComponent }];

@NgModule({
	declarations: [LastwatchComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
	],
})
export class LastwatchModule { }
