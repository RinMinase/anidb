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
			loading: false,
		});

		this.activate();
	}

	activate() {

	}

	authenticate() {
		this.loading = true;
		this.firebase.login(this.email, this.password)
			.then(() => {
				this.loading = false;
				this.$state.go("home.manage");
			}).catch((error) => {
				this.loading = false;
				this.$log.error(error.message);
			});
	}
}
