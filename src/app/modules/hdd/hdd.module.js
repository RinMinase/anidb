import { HddController } from "./hdd.controller";

import HddDOM from "ngtemplate!html!./hdd.html";

export default angular
	.module("hdd", [])

	.controller("HddController", HddController)

	.config(($stateProvider) => {
		$stateProvider
			.state("hdd", {
				url: "/hdd",
				templateUrl: HddDOM,
				controller: "HddController",
				controllerAs: "vm",
			});
	});
