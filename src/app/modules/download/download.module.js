import { ManageDownloadController } from "./manage/manage-download.controller";

import manageDownloadDOM from "./manage/manage-download.html";

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
				templateUrl: manageDownloadDOM,
				controller: "ManageDownloadController",
				controllerAs: "vm",
			});
	});
