import _ from "lodash";

export function NavbarDirective() {
	"ngInject";

	const directive = {
		restrict: "E",
		templateUrl: "app/core/directives/navbar/navbar.html",
		scope: {},
		controller: NavbarController,
		controllerAs: "vm",
		bindToController: true,
	};

	return directive;
}

class NavbarController {
	constructor($state, firebase) {
		"ngInject";

		_.extend(this, {
			$state,
			firebase,
		});
	}

	logout() {
		this.firebase.logout()
			.then(() => {
				this.$state.go("login");
			});
	}
}
