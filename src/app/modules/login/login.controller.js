export class LoginController {
	constructor (
		$scope,
		$state,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$scope,
			$state,
			firebase,

			alert: null,
			loading: false,
		});

		this.activate();
	}

	activate() {

	}

	authenticate() {
		this.loading = true;
		this.alerts = null;

		this.firebase.login(this.email, this.password)
			.then(() => {
				this.$state.go("home.manage");
			}).catch((error) => {
				this.loading = false;

				switch (error.code) {
					case "auth/invalid-email":
					case "auth/user-not-found":
					case "auth/argument-error":
						this.alert = "Invalid username or password.";
						break;
					default:
						this.alert = "An unkown error has occurred.";
				}

				this.$scope.$digest();
			});
	}

	closeAlert() {
		this.alert = null;
	}
}
