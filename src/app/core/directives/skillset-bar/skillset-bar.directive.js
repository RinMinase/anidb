export function SkillsetBarDirective() {
	"ngInject";

	const directive = {
		restrict: "E",
		templateUrl: "app/core/directives/skillset-bar/skillset-bar.html",
		scope: {
			logo: "@",
			name: "@",
			value: "@",
		},
		controller: SkillsetBarController,
		controllerAs: "vm",
		bindToController: true,
	};

	return directive;
}

class SkillsetBarController {
	constructor() {
		"ngInject";

		this.value = parseInt(this.value);
	}
}
