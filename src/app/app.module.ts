import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";

import { environment } from "@env/environment";

import { AppComponent } from "./app.component";

import { NavbarModule } from "@components/navbar/navbar.module";
import { FooterModule } from "@components/footer/footer.module";

import { LoginModule } from "@modules/login/login.module";
import { HomeModule } from "@modules/home/home.module";

const routes: Routes = [{
	path: "about",
	loadChildren: () => import("./modules/about/about.module").then((m) => m.AboutModule),
}, {
	path: "by-name",
	loadChildren: () => import("./modules/by-name/by-name.module").then((m) => m.ByNameModule),
}, {
	path: "by-year",
	loadChildren: () => import("./modules/by-year/by-year.module").then((m) => m.ByYearModule),
}, {
	path: "download",
	loadChildren: () => import("./modules/download/download.module").then((m) => m.DownloadModule),
}, {
	path: "export",
	loadChildren: () => import("./modules/export/export.module").then((m) => m.ExportModule),
}, {
	path: "hdd",
	loadChildren: () => import("./modules/hdd/hdd.module").then((m) => m.HddModule),
}, {
	path: "lastwatch",
	loadChildren: () => import("./modules/lastwatch/lastwatch.module").then((m) => m.LastwatchModule),
}, {
	path: "summer",
	loadChildren: () => import("./modules/summer/summer.module").then((m) => m.SummerModule),
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
		ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }),
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
