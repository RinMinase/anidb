import _ from "lodash";

export class ViewHomeController {
	constructor (
		$log,
		$scope,
		$state,
		$stateParams,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$log,
			$scope,
			$state,
			$stateParams,
			firebase,
			data: {},
			dataLoaded: false,
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve("anime", this.$stateParams.id)
					.then((data) => {
						if (data.variants) {
							data.shortTitle = data.variants.split(",")
								.sort((a, b) => a.length - b.length)[0];
						}

						data.variants = data.variants.split(",");
						data.offquel = data.offquel.split(",");

						this.data = data;
						this.dataLoaded = true;
						this.$scope.$apply();
					});
			}).catch(() => {
				this.$state.go("login");
			});
	}
}
