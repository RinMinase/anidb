import { AddHomeController } from "./add/add-home.controller";
import { ManageHomeController } from "./manage/manage-home.controller";
import { UpdateHomeController } from "./update/update-home.controller";
import { ViewHomeController } from "./view/view-home.controller";

import manageHomeDOM from "./manage/manage-home.html";
import viewHomeDOM from "./view/view-home.html";

export default angular
	.module("home", [])

	.controller("AddHomeController", AddHomeController)
	.controller("ManageHomeController", ManageHomeController)
	.controller("UpdateHomeController", UpdateHomeController)
	.controller("ViewHomeController", ViewHomeController)

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
				params: {
					id: { value: null },
					search: { value: null },
				},
			})
			.state("home.view", {
				url: "/view/{id:int}",
				templateUrl: viewHomeDOM,
				controller: "ViewHomeController",
				controllerAs: "vm",
				params: {
					search: { value: null },
				},
			});
	});
