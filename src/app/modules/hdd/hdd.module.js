import { ManageHddController } from "./manage/manage-hdd.controller";

import manageHddDOM from "./manage/manage-hdd.html";

export default angular
	.module("hdd", [])

	.controller("ManageHddController", ManageHddController)

	.config(($stateProvider) => {
		$stateProvider
			.state("hdd", {
				abstract: true,
				template: "<div ui-view></div>",
			})
			.state("hdd.manage", {
				url: "/hdd",
				templateUrl: manageHddDOM,
				controller: "ManageHddController",
				controllerAs: "vm",
			});
	});
