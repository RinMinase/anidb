import _ from "lodash";

export class ManageHddController {
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
			data: {},
			dataLoaded: false,
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve("hdd")
					.then((data) => {
						this.formatData(data);
						this.dataLoaded = true;
						this.$scope.$apply();
					});
			}).catch(() => {
				this.$state.go("login");
			});
	}

	formatData(data) {
		return data;
	}
}
