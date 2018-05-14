export function QualityLegendDirective() {
	"ngInject";

	const directive = {
		restrict: "E",
		templateUrl: "app/core/directives/quality-legend/quality-legend.html",
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
