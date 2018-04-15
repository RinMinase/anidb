/* global malarkey:false, moment:false */

/* eslint-disable max-len */

import { config } from "./index.config";
import { routerConfig } from "./index.route";
import { runBlock } from "./index.run";
import { MainController } from "./main/main.controller";
import { GithubContributorService } from "../app/components/githubContributor/githubContributor.service";
import { WebDevTecService } from "../app/components/webDevTec/webDevTec.service";
import { NavbarDirective } from "../app/components/navbar/navbar.directive";
import { MalarkeyDirective } from "../app/components/malarkey/malarkey.directive";

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
	.directive("acmeNavbar", NavbarDirective)
	.directive("acmeMalarkey", MalarkeyDirective);

/* eslint-enable */
