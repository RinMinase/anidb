import { LastWatchController } from "./lastwatch.controller";

export default angular
	.module("lastwatch", [])
	.controller("LastWatchController", LastWatchController)
	.config(($stateProvider) => {
		$stateProvider
			.state("lastwatch", {
				url: "/lastwatch",
				templateUrl: "app/modules/lastwatch/lastwatch.html",
				controller: "LastWatchController",
				controllerAs: "vm",
			});
	});
