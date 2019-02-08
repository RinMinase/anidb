import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { BynameComponent } from "./byname.component";

const routes: Routes = [{ path: "", component: BynameComponent }];

@NgModule({
	declarations: [BynameComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
	],
})
export class BynameModule { }
