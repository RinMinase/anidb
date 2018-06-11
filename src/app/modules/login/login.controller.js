import firebase from "firebase/app";

import "firebase/auth";

export class LoginController {
	constructor (
		$log,
		$scope,
		$state
	) {
		"ngInject";

		this.$log = $log;
		this.$scope = $scope;
		this.$state = $state;

		this.activate();
	}

	activate() {

	}

	authenticate() {
		firebase.auth()
			.signInWithEmailAndPassword(
				this.$scope.email,
				this.$scope.password
			).then(() => {
				this.$state.go("home.manage");
			}).catch((error) => {
				this.$log.error(error.message);
			});
	}
}
