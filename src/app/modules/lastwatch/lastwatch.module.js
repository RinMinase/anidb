import { LastWatchController } from "./lastwatch.controller";

import LastWatchDOM from "ngtemplate!html!./lastwatch.html";

export default angular
	.module("lastwatch", [])
	.controller("LastWatchController", LastWatchController)
	.config(($stateProvider) => {
		$stateProvider
			.state("lastwatch", {
				url: "/lastwatch",
				templateUrl: LastWatchDOM,
				controller: "LastWatchController",
				controllerAs: "vm",
			});
	});
