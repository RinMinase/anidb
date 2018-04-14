"use strict";

import mainDOM from "./main.html";
import MainController from "./main.controller";

export default angular
	.module(
		"main",
		["ui.router"]
	)
	.component("main", {
		templateUrl: mainDOM,
		controller: MainController,
	});
