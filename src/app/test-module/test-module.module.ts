import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TestModuleComponent } from "./test-module.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [{
	path: "test-module", component: TestModuleComponent,
}];

@NgModule({
	declarations: [TestModuleComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
	],
})
export class TestModuleModule { }
