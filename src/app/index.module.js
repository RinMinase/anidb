/* global malarkey:false, moment:false */

/* eslint-disable max-len */

import { config } from "./index.config";
import { routerConfig } from "./index.route";
import { runBlock } from "./index.run";

import { MainController } from "./main/main.controller";
import { LoginController } from "./modules/login/login.controller";

import { GithubContributorService } from "./core/services/githubContributor.service";
import { WebDevTecService } from "./core/services/webDevTec.service";

import { NavbarDirective } from "./core/directives/navbar/navbar.directive";
import { MalarkeyDirective } from "./core/directives/malarkey/malarkey.directive";

angular.module(
	"anidbAngular", [
		"ngAnimate",
		"ngCookies",
		"ngSanitize",
		"ngMessages",
		"ui.router",
		"ui.bootstrap",
		"toastr",
	])
	.constant("malarkey", malarkey)
	.constant("moment", moment)
	.config(config)
	.config(routerConfig)
	.run(runBlock)
	.service("githubContributor", GithubContributorService)
	.service("webDevTec", WebDevTecService)
	.controller("MainController", MainController)
	.controller("LoginController", LoginController)
	.directive("acmeNavbar", NavbarDirective)
	.directive("acmeMalarkey", MalarkeyDirective);

/* eslint-enable */
