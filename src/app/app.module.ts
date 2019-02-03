import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { LoginModule } from "./modules/login/login.module";
import { HomeModule } from "./modules/home/home.module";

import { NavbarComponent } from "./core/components/navbar/navbar.component";
import { FooterComponent } from "./core/components/footer/footer.component";

const routes: Routes = [{
	path: "lazy-test-module",
	loadChildren: "./modules/lazy-test-module/lazy-test-module.module#LazyTestModuleModule",
}, {
	path: "",
	pathMatch: "full",
	redirectTo: "",
}];

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		FooterComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),
		NgbModule,

		LoginModule,
		HomeModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule { }
