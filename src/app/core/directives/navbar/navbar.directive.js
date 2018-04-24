import firebase from "firebase";
import Promise from "bluebird";

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
	constructor () {
		"ngInject";
	}

	logout() {
		const signOut = () => new Promise((resolve) => {
			firebase.auth()
				.signOut()
				.then(() => {
					resolve();
				});
		});

		signOut();
	}
}
