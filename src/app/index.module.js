import "angular";
import "angular-animate";
import "angular-bootstrap";
import "angular-cookies";
import "angular-messages";
import "angular-sanitize";
import "angular-toastr";
import uiRouter from "@uirouter/angularjs";

import { config, runBlock } from "./index.config";
import { routerConfig } from "./index.route";

import { MainController } from "./main/main.controller";
import { LoginController } from "./modules/login/login.controller";
import { FiretestController } from "./firetest/firetest.controller";
import { ManageHomeController } from "./modules/home/manage/manage-home.controller";

import { GithubContributorService } from "./core/services/githubContributor.service";
import { WebDevTecService } from "./core/services/webDevTec.service";

import { NavbarDirective } from "./core/directives/navbar/navbar.directive";
import { FooterDirective } from "./core/directives/footer/footer.directive";
import { MalarkeyDirective } from "./core/directives/malarkey/malarkey.directive";

angular.module(
	"anidbAngular", [
		"ngAnimate",
		"ngCookies",
		"ngMessages",
		"ngSanitize",
		uiRouter,
		"ui.bootstrap",
		"toastr",
	])

	.config(config)
	.config(routerConfig)

	.run(runBlock)

	.service("githubContributor", GithubContributorService)
	.service("webDevTec", WebDevTecService)

	.controller("MainController", MainController)
	.controller("LoginController", LoginController)
	.controller("FiretestController", FiretestController)
	.controller("ManageHomeController", ManageHomeController)

	.directive("anidbNavbar", NavbarDirective)
	.directive("anidbFooter", FooterDirective)
	.directive("acmeMalarkey", MalarkeyDirective);
