import { NgModule, Component } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Router, Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import firebase from "firebase/compat/app";

import { NavbarModule } from "@components/navbar/navbar.module";
import { FooterModule } from "@components/footer/footer.module";
import { Page404Module } from "@components/page404/page404.module";
import { Page500Module } from "@components/page500/page500.module";

import { LoginModule } from "./login/login.module";
import { HomeModule } from "./home/home.module";

const isDev: boolean = window.location.origin.includes("local");
const routes: Routes = [
	{
		path: "about",
		loadChildren: () =>
			import("./about/about.module").then((m) => m.AboutModule),
	},
	{
		path: "by-name",
		loadChildren: () =>
			import("./by-name/by-name.module").then((m) => m.ByNameModule),
	},
	{
		path: "by-year",
		loadChildren: () =>
			import("./by-year/by-year.module").then((m) => m.ByYearModule),
	},
	{
		path: "download",
		loadChildren: () =>
			import("./download/download.module").then((m) => m.DownloadModule),
	},
	{
		path: "export",
		loadChildren: () =>
			import("./export/export.module").then((m) => m.ExportModule),
	},
	{
		path: "hdd",
		loadChildren: () => import("./hdd/hdd.module").then((m) => m.HddModule),
	},
	{
		path: "hdd-sim",
		loadChildren: () => import("./hdd-sim/hdd-sim.module").then((m) => m.HddSimModule),
	},
	{
		path: "lastwatch",
		loadChildren: () =>
			import("./lastwatch/lastwatch.module").then((m) => m.LastwatchModule),
	},
	{
		path: "summer",
		loadChildren: () =>
			import("./summer/summer.module").then((m) => m.SummerModule),
	},
	{
		path: "",
		pathMatch: "full",
		redirectTo: "",
	},
	{
		path: "**",
		redirectTo: "/404",
	},
];

@Component({
	selector: "app-root",
	template: `
		<app-navbar
			*ngIf="router.url !== '/login'"
			[isHomeScreen]="router.url === '/'"
		></app-navbar>
		<router-outlet></router-outlet>
		<app-footer *ngIf="router.url !== '/login'"></app-footer>
	`,
})
export class AppComponent {
	testValue: string;

	constructor(public router: Router) {
		const firebaseConfig = {
			apiKey: process.env.FIRE_API_KEY || "",
			databaseURL: process.env.FIRE_DB_URL || "",
			projectId: process.env.FIRE_PROJECT_ID || "",
			storageBucket: process.env.FIRE_STORAGE_BUCKET || "",
		};

		firebase.initializeApp(firebaseConfig);
	}
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes, { anchorScrolling: "enabled" }),
		ServiceWorkerModule.register("ngsw-worker.js", { enabled: !isDev }),
		HttpClientModule,

		NavbarModule,
		FooterModule,
		Page404Module,
		Page500Module,

		LoginModule,
		HomeModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
