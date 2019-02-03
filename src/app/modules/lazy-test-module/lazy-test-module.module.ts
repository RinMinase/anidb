import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { LazyTestModuleComponent } from "./lazy-test-module.component";

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
