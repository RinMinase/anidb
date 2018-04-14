"use strict";

import "./login.scss";
import loginDOM from "./login.html";
import LoginController from "./login.controller";

export default angular
	.module(
		"LoginController",
		["ui.router"]
	)
	.component("login", {
		templateUrl: loginDOM,
		controller: LoginController,
	});
