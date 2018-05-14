import { ByNameController } from "./byname.controller";

export default angular
	.module("byname", [])
	.controller("ByNameController", ByNameController)
	.config(($stateProvider) => {
		$stateProvider
			.state("byname", {
				url: "/byname",
				templateUrl: "app/modules/byname/byname.html",
				controller: "ByNameController",
				controllerAs: "vm",
			});
	});
