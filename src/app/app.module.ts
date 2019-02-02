import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { TestModuleModule } from "./test-module/test-module.module";
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
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),

		TestModuleModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule { }
