"use strict";

import indexComponents from "./index.components";
import { routeConfig } from "./index.routes";
import coreModule from "./core/core.module";
import mainModule from "./pages/main/main.module";
import { LoginController } from "./pages/login/login.controller";

import uiRouter from "@uirouter/angularjs";

/* eslint-disable no-inline-comments, line-comment-position */
export default angular
	.module(
		"anidb-angular", [
			// plugins
			uiRouter,
			"ngAnimate",
			"ngCookies",
			"ngTouch",
			"ngSanitize",
			"ngMessages",
			"oc.lazyLoad",

			coreModule.name,		// core
			indexComponents.name,	// components
			mainModule.name,		// pages
		]
	)
	.config(($logProvider, $compileProvider) => {
		"ngInject";

		$logProvider.debugEnabled(true);
		if (NODE_ENV === "production") {
			$logProvider.debugEnabled(false);
			$compileProvider.debugInfoEnabled(false);
		}
	})
	.config(routeConfig)
	.controller("LoginController", LoginController);
/* eslint-enable */
