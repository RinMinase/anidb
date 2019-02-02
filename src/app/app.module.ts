import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { TestModuleModule } from "./test-module/test-module.module";
import { LoginModule } from "./login/login.module";
import { HomeModule } from "./home/home.module";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";

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
		NavbarComponent,
		FooterComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),
		NgbModule,

		TestModuleModule,
		LoginModule,
		HomeModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule { }
