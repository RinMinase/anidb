import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LazyTestModuleComponent } from "./lazy-test-module.component";

const routes: Routes = [{
	path: "",
	component: LazyTestModuleComponent,
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LazyTestModuleRoutingModule { }
