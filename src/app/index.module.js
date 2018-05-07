import "angular";
import "angular-animate";
import "angular-cookies";
import "angular-filter";
import "angular-messages";
import "angular-sanitize";
import "angular-toastr";
import "angular-ui-bootstrap";
import uiRouter from "@uirouter/angularjs";

import "jquery";
import "oclazyload";

import { config, runBlock, routerConfig } from "./index.config";

import { MainController } from "./main/main.controller";
import { FiretestController } from "./firetest/firetest.controller";

import CoreModule from "./core/core.module";

import AboutModule from "./modules/about/about.module";
import DownloadModule from "./modules/download/download.module";
import HomeModule from "./modules/home/home.module";
import LastwatchModule from "./modules/lastwatch/lastwatch.module";
import LoginModule from "./modules/login/login.module";

angular.module(
	"anidbAngular", [
		"angular.filter",
		"ngAnimate",
		"ngCookies",
		"ngMessages",
		"ngSanitize",
		uiRouter,
		"ui.bootstrap",
		"toastr",

		CoreModule.name,

		AboutModule.name,
		DownloadModule.name,
		HomeModule.name,
		LastwatchModule.name,
		LoginModule.name,
	])

	.config(config)
	.config(routerConfig)

	.run(runBlock)

	.controller("MainController", MainController)
	.controller("FiretestController", FiretestController);
