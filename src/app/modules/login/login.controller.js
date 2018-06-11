import Promise from "bluebird";

export class LoginController {
	constructor (
		$log,
		$scope,
		$state,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$log,
			$scope,
			$state,
			firebase,
		});

		this.activate();
	}

	activate() {

	}

	authenticate() {
		Promise.resolve(this.firebase.login(this.email, this.password))
			.then(() => {
				this.$state.go("home.manage");
			}).catch((error) => {
				this.$log.error(error.message);
			});
	}
}
