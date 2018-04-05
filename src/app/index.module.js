"use strict";

import indexComponents from "./index.components";
import indexRoutes from "./index.routes";
import coreModule from "./core/core.module";
import mainModule from "./pages/main/main.module";

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
			indexRoutes.name,		// routes
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
	});
/* eslint-enable */
