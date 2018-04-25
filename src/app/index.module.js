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
import "ngStorage";
import "oclazyload";

import { config, runBlock, routerConfig } from "./index.config";

import { MainController } from "./main/main.controller";
import { FiretestController } from "./firetest/firetest.controller";

import CoreModule from "./core/core.module";

import AboutModule from "./modules/about/about.module";
import HomeModule from "./modules/home/home.module";
import LoginModule from "./modules/login/login.module";

angular.module(
	"anidbAngular", [
		"angular.filter",
		"ngAnimate",
		"ngCookies",
		"ngMessages",
		"ngSanitize",
		"ngStorage",
		uiRouter,
		"ui.bootstrap",
		"toastr",

		CoreModule.name,

		AboutModule.name,
		HomeModule.name,
		LoginModule.name,
	])

	.config(config)
	.config(routerConfig)

	.run(runBlock)

	.controller("MainController", MainController)
	.controller("FiretestController", FiretestController);
