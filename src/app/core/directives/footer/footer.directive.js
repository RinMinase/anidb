export function FooterDirective() {
	"ngInject";

	return {
		restrict: "E",
		templateUrl: "app/core/directives/footer/footer.html",
		controller: FooterController,
		controllerAs: "vm",
		bindToController: true,
	};
}

class FooterController {
	constructor (moment) {
		"ngInject";

		// "this.creationDate" is available by directive option "bindToController: true"
		this.relativeDate = moment(this.creationDate).fromNow();
	}
}
