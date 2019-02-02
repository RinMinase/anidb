import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TestModuleComponent } from "./test-module.component";

const routes: Routes = [{
	path: "test-module", component: TestModuleComponent,
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TestModuleRoutingModule { }
