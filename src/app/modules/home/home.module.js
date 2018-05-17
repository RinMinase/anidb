import { AddHomeController } from "./add/add-home.controller";
import { ManageHomeController } from "./manage/manage-home.controller";

import manageHomeDOM from "ngtemplate!html!./manage/manage-home.html";

export default angular
	.module("home", [])

	.controller("AddHomeController", AddHomeController)
	.controller("ManageHomeController", ManageHomeController)

	.config(($stateProvider) => {
		$stateProvider
			.state("home", {
				abstract: true,
				template: "<div ui-view></div>",
			})
			.state("home.manage", {
				url: "/",
				templateUrl: manageHomeDOM,
				controller: "ManageHomeController",
				controllerAs: "vm",
			});
	});
