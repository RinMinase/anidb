import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LazyTestModuleComponent } from "./lazy-test-module.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [{
	path: "",
	component: LazyTestModuleComponent,
}];

@NgModule({
	declarations: [LazyTestModuleComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
	],
})
export class LazyTestModuleModule { }
