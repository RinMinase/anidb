import firebase from "firebase";

export class LoginController {
	constructor (
		$log,
		$scope,
		$window
	) {
		"ngInject";

		this.$log = $log;
		this.$scope = $scope;
		this.$window = $window;

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
				this.$window.location.href = "/";
			}).catch((error) => {
				this.$log.error(error.message);
			});
	}
}
