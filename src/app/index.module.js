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

import { config, runBlock } from "./index.config";
import { routerConfig } from "./index.route";

import { MainController } from "./main/main.controller";
import { LoginController } from "./modules/login/login.controller";
import { FiretestController } from "./firetest/firetest.controller";

import HomeModule from "./modules/home/home.module";

import { GithubContributorService } from "./core/services/githubContributor.service";
import { WebDevTecService } from "./core/services/webDevTec.service";

import { NavbarDirective } from "./core/directives/navbar/navbar.directive";
import { FooterDirective } from "./core/directives/footer/footer.directive";
import { MalarkeyDirective } from "./core/directives/malarkey/malarkey.directive";

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

		HomeModule.name,
	])

	.config(config)
	.config(routerConfig)

	.run(runBlock)

	.service("githubContributor", GithubContributorService)
	.service("webDevTec", WebDevTecService)

	.controller("MainController", MainController)
	.controller("LoginController", LoginController)
	.controller("FiretestController", FiretestController)

	.directive("anidbNavbar", NavbarDirective)
	.directive("anidbFooter", FooterDirective)
	.directive("anidbMalarkey", MalarkeyDirective);
