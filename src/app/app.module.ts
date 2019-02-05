import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";

import { NavbarModule } from "./core/components/navbar/navbar.module";
import { FooterModule } from "./core/components/footer/footer.module";

import { LoginModule } from "./modules/login/login.module";
import { HomeModule } from "./modules/home/home.module";

const routes: Routes = [{
	path: "about",
	loadChildren: "./modules/about/about.module#AboutModule",
}, {
	path: "child",
	loadChildren: "./modules/child/child.module#ChildModule",
}, {
	path: "",
	pathMatch: "full",
	redirectTo: "",
}];

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),
		HttpClientModule,
		NgbModule,

		NavbarModule,
		FooterModule,

		LoginModule,
		HomeModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule { }
