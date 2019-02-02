import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TestModuleComponent } from "./test-module.component";
import { TestModuleRoutingModule } from "./test-module-routing.module";

@NgModule({
	declarations: [TestModuleComponent],
	imports: [
		CommonModule,
		TestModuleRoutingModule,
	],
})
export class TestModuleModule { }
