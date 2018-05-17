import { AboutController } from "./about.controller";

import aboutDOM from "ngtemplate!html!./about.html";

export default angular
	.module("about", [])
	.controller("AboutController", AboutController)
	.config(($stateProvider) => {
		$stateProvider
			.state("about", {
				url: "/about",
				templateUrl: aboutDOM,
				controller: "AboutController",
				controllerAs: "vm",
			});
	});
