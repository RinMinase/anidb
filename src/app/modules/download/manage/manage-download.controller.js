import _ from "lodash";

export class ManageDownloadController {
	constructor(
		$log,
		$scope,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$log,
			$scope,
			firebase,
			data: {},
			dataLoaded: false,
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						this.data = this.formatData(data);
						this.dataLoaded = true;
						this.$scope.$apply();
					});
			}).catch(() => {
				this.$window.location.href = "/login";
			});
	}

	formatData(data) {
		const filteredData = data.filter((value) => value.watchStatus > 1);

		this.$log.log(filteredData);

		// let uncategorizedData = filteredData.filter((value) => !value.releaseYear);
		// let categorizedData = filteredData.filter((value) => !!value.releaseYear);
		// let years = {};
		// filteredData.map((value) => {
		// 	if (!value.releaseYear) {

		// 	}
		// });
	}
}
