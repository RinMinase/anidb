import { AddHomeController } from "./add/add-home.controller";
import { ManageHomeController } from "./manage/manage-home.controller";

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
				templateUrl: "app/modules/home/manage/manage-home.html",
				controller: "ManageHomeController",
				controllerAs: "vm",
			});
	});
