import { ManageHomeController } from "./manage/manage-home.controller";

export default angular
	.module("home", [])
	.config(($stateProvider) => {
		$stateProvider
			.state("home", {
				abstract: true,
				template : "<div ui-view></div>",
			})
			.state("home.manage", {
				url: "/manage",
				templateUrl: "app/modules/home/manage/manage-home.html",
				controller: "ManageHomeController",
				controllerAs: "vm",
			});
	})
	.controller("ManageHomeController", ManageHomeController);
