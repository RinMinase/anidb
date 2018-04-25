import { AboutController } from "./about.controller";

export default angular
	.module("about", [])
	.controller("AboutController", AboutController)
	.config(($stateProvider) => {
		$stateProvider
			.state("about", {
				url: "/about",
				templateUrl: "app/modules/about/about.html",
				controller: "AboutController",
				controllerAs: "vm",
			});
	});
