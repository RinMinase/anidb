import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [{
	path: "lazy-test-module",
	loadChildren: "./lazy-test-module/lazy-test-module.module#LazyTestModuleModule",
}, {
	path: "",
	pathMatch: "full",
	redirectTo: "",
}];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
