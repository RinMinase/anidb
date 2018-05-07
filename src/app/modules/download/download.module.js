import { ManageDownloadController } from "./manage/manage-download.controller";

export default angular
	.module("download", [])

	.controller("ManageDownloadController", ManageDownloadController)

	.config(($stateProvider) => {
		$stateProvider
			.state("download", {
				abstract: true,
				template: "<div ui-view></div>",
			})
			.state("download.manage", {
				url: "/download-list",
				templateUrl: "app/modules/download/manage/manage-download.html",
				controller: "ManageDownloadController",
				controllerAs: "vm",
			});
	});
