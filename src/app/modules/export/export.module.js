import { ExcelController } from "./excel/excel.controller";

import excelDOM from "./excel/excel.html";

export default angular
	.module("export", [])

	.controller("ExcelController", ExcelController)

	.config(($stateProvider) => {
		$stateProvider
			.state("export", {
				abstract: true,
				template: "<div ui-view></div>",
				url: "/export",
			})
			.state("export.excel", {
				url: "/excel",
				templateUrl: excelDOM,
				controller: "ExcelController",
				controllerAs: "vm",
			});
	});
