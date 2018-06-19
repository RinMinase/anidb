import skillsetBarDOM from "./skillset-bar.html";

export function SkillsetBarDirective() {
	"ngInject";

	const directive = {
		restrict: "E",
		templateUrl: skillsetBarDOM,
		scope: {
			name: "@",
			sprite: "@",
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
