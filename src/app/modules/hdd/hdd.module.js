import { ManageHddController } from "./manage/manage-hdd.controller";

import manageHddDOM from "ngtemplate!html!./manage/manage-hdd.html";

export default angular
	.module("hdd", [])

	.controller("ManageHddController", ManageHddController)

	.config(($stateProvider) => {
		$stateProvider
			.state("hdd", {
				url: "/hdd",
				templateUrl: manageHddDOM,
				controller: "ManageHddController",
				controllerAs: "vm",
			});
	});
