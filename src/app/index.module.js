import "angular";
import "angular-animate";
import "angular-chart.js";
import "angular-sweetalert";
import "ui-bootstrap4";
import uiRouter from "@uirouter/angularjs";
// import "angular-hammer";

import "sweetalert";
import "velocity-animate";

import { config, run } from "./index.config";

import CoreModule from "./core/core.module";

import AboutModule from "./modules/about/about.module";
import ByNameModule from "./modules/byname/byname.module";
import DownloadModule from "./modules/download/download.module";
import ExportModule from "./modules/export/export.module";
import HddModule from "./modules/hdd/hdd.module";
import HomeModule from "./modules/home/home.module";
import LastwatchModule from "./modules/lastwatch/lastwatch.module";
import LoginModule from "./modules/login/login.module";
import SummerModule from "./modules/summer/summer.module";

angular.module(
	"anidbAngular", [
		"chart.js",
		// "hmTouchEvents",
		"ngAnimate",
		"oitozero.ngSweetAlert",
		uiRouter,
		"ui.bootstrap",

		CoreModule.name,

		AboutModule.name,
		ByNameModule.name,
		DownloadModule.name,
		ExportModule.name,
		HddModule.name,
		HomeModule.name,
		LastwatchModule.name,
		LoginModule.name,
		SummerModule.name,
	])
	.config(config)
	.run(run);
