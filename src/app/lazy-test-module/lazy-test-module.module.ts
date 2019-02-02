import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LazyTestModuleRoutingModule } from "./lazy-test-module-routing.module";
import { LazyTestModuleComponent } from "./lazy-test-module.component";

@NgModule({
	declarations: [LazyTestModuleComponent],
	imports: [
		CommonModule,
		LazyTestModuleRoutingModule,
	],
})
export class LazyTestModuleModule { }
