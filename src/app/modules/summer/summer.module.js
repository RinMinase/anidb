import { ManageSummerController } from "./manage/manage-summer.controller";

import manageSummerDOM from "./manage/manage-summer.html";

export default angular
	.module("summer", [])

	.controller("ManageSummerController", ManageSummerController)

	.config(($stateProvider) => {
		$stateProvider
			.state("summer", {
				abstract: true,
				template: "<div ui-view></div>",
			})
			.state("summer.manage", {
				url: "/summer",
				templateUrl: manageSummerDOM,
				controller: "ManageSummerController",
				controllerAs: "vm",
			});
	});
