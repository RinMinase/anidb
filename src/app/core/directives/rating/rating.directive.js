import ratingDOM from "ngtemplate-loader!html-loader!./rating.html";

export function RatingDirective() {
	"ngInject";

	const directive = {
		restrict: "E",
		templateUrl: ratingDOM,
		scope: {
			value: "@",
			audio: "@",
			enjoyment: "@",
			graphics: "@",
			plot: "@",
		},
		controller: RatingController,
		controllerAs: "vm",
		bindToController: true,
	};

	return directive;
}

class RatingController {
	constructor() {
		"ngInject";
	}
}
