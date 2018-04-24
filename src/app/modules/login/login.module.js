import { LoginController } from "./login.controller";

export default angular
	.module("login", [])
	.controller("LoginController", LoginController)
	.config(($stateProvider) => {
		$stateProvider
			.state("login", {
				url: "/login",
				templateUrl: "app/modules/login/login.html",
				controller: "LoginController",
				controllerAs: "vm",
			});
	});
