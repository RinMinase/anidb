import { CSVController } from "./csv/csv.controller";
import { ExcelController } from "./excel/excel.controller";

import csvDOM from "./csv/csv.html";
import excelDOM from "./excel/excel.html";

export default angular
	.module("export", [])

	.controller("CSVController", CSVController)
	.controller("ExcelController", ExcelController)

	.config(($stateProvider) => {
		$stateProvider
			.state("export", {
				abstract: true,
				template: "<div ui-view></div>",
				url: "/export",
			})
			.state("export.csv", {
				url: "/csv",
				templateUrl: csvDOM,
				controller: "CSVController",
				controllerAs: "vm",
				resolve: {
					loadMyCtrl: ["$ocLazyLoad", ocLazyLoader],
				},
			})
			.state("export.excel", {
				url: "/excel",
				templateUrl: excelDOM,
				controller: "ExcelController",
				controllerAs: "vm",
				resolve: {
					loadMyCtrl: ["$ocLazyLoad", ocLazyLoader],
				},
			});
	});

function ocLazyLoader($ocLazyLoad) {
	"ngInject";

	return $ocLazyLoad.load([
		"./dependencies/xlsx.full.min.js",
	]);
}
