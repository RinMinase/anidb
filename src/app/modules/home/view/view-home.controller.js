import _ from "lodash";

export class ViewHomeController {
	constructor (
		$log,
		$state,
		$stateParams,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$log,
			$state,
			$stateParams,
			firebase,
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve("anime", this.$stateParams.id)
					.then((data) => {
						this.$log.log(data);
					});
			}).catch(() => {
				this.$state.go("login");
			});
	}
}
