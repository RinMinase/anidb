import { SummerController } from "./summer.controller";

import summerDOM from "ngtemplate!html!./summer.html";

export default angular
	.module("summer", [])

	.controller("SummerController", SummerController)

	.config(($stateProvider) => {
		$stateProvider
			.state("summer", {
				url: "/summer",
				templateUrl: summerDOM,
				controller: "SummerController",
				controllerAs: "vm",
			});
	});
