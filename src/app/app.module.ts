import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";

import { NavbarModule } from "@components/navbar/navbar.module";
import { FooterModule } from "@components/footer/footer.module";

import { LoginModule } from "@modules/login/login.module";
import { HomeModule } from "@modules/home/home.module";

const routes: Routes = [{
	path: "about",
	loadChildren: "./modules/about/about.module#AboutModule",
}, {
	path: "byname",
	loadChildren: "./modules/byname/byname.module#BynameModule",
}, {
	path: "download",
	loadChildren: "./modules/download/download.module#DownloadModule",
}, {
	path: "export",
	loadChildren: "./modules/export/export.module#ExportModule",
}, {
	path: "hdd",
	loadChildren: "./modules/hdd/hdd.module#HddModule",
}, {
	path: "lastwatch",
	loadChildren: "./modules/lastwatch/lastwatch.module#LastwatchModule",
}, {
	path: "summer",
	loadChildren: "./modules/summer/summer.module#SummerModule",
}, {
	path: "",
	pathMatch: "full",
	redirectTo: "",
}];

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes, { anchorScrolling: "enabled" }),
		HttpClientModule,

		NavbarModule,
		FooterModule,

		LoginModule,
		HomeModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule { }
