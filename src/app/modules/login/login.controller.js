import extend from "lodash/extend";

export class LoginController {
	constructor (
		$document,
		$scope,
		$state,
		$timeout,
		firebase
	) {
		"ngInject";

		extend(this, {
			$document,
			$scope,
			$state,
			$timeout,
			firebase,

			alert: null,
			loading: false,
		});

		this.activate();
	}

	activate() {
		this.$timeout(() => {
			this.$document[0].querySelectorAll(".animated-input")
				.forEach((element) => {
					const ngElement = angular.element(element);

					if (ngElement.val()) {
						ngElement.parent().addClass("focused");
					}

					ngElement.bind("focus", () => {
						ngElement.parent().addClass("focused");
					});

					ngElement.bind("blur", () => {
						if (!ngElement.val()) {
							ngElement.removeClass("filled");
							ngElement.parent().removeClass("focused");
						} else {
							ngElement.addClass("filled");
						}
					});
				});
		}, 500);
	}

	authenticate() {
		this.loading = true;
		this.alerts = null;

		this.firebase.login(this.email, this.password)
			.then(() => this.$state.go("home.manage"))
			.catch((error) => {
				this.loading = false;

				switch (error.code) {
					case "auth/invalid-email":
					case "auth/user-not-found":
					case "auth/argument-error":
					case "auth/wrong-password":
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
