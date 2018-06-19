import qualityLegendDOM from "ngtemplate-loader!html-loader!./quality-legend.html";

export function QualityLegendDirective() {
	"ngInject";

	const directive = {
		restrict: "E",
		templateUrl: qualityLegendDOM,
		scope: {
			value: "@",
		},
		controller: QualityLegendController,
		controllerAs: "vm",
		bindToController: true,
	};

	return directive;
}

class QualityLegendController {
	constructor() {
		"ngInject";
	}
}
