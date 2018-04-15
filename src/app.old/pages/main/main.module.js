"use strict";

import mainDOM from "./main.html";
import MainController from "./main.controller";

export default angular
	.module(
		"main",
		["ui.router"]
	)
	.config(($stateProvider, $urlRouterProvider) => {
		"ngInject";

		$urlRouterProvider.otherwise("/");

		$stateProvider.state("main", {
			url: "/",
			component: "main",
		});
	})
	.component("main", {
		templateUrl: mainDOM,
		controller: MainController,
	});
