export function NavbarDirective() {
	"ngInject";

	const directive = {
		restrict: "E",
		templateUrl: "app/core/directives/navbar/navbar.html",
		scope: { creationDate: "=" },
		controller: NavbarController,
		controllerAs: "vm",
		bindToController: true,
	};

	return directive;
}

class NavbarController {
	constructor () {
		"ngInject";
	}
}
