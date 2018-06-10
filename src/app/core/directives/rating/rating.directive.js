import ratingDOM from "ngtemplate!html!./rating.html";

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
