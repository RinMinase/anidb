export function FooterDirective() {
	"ngInject";

	const directive = {
		restrict: "E",
		templateUrl: "app/core/directives/footer/footer.html",
		scope: {},
		controller: FooterController,
		controllerAs: "vm",
		bindToController: true,
	};

	return directive;
}

class FooterController {
	constructor () {
		"ngInject";
	}
}
