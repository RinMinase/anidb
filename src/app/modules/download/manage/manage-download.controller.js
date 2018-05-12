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
		// const filteredData = data.filter((value) => value.watchStatus > 1);

		// this.$log.log(filteredData);

		data.uncategorized = {};
		const uData = data.filter((value) => !value.releaseYear);

		data.uncategorized.headers = {};
		const uWatched = uData.filter((value) => value.watchStatus === 0).length;
		const uDownloaded = uData.filter((value) => value.watchStatus === 2).length;
		const uQueued = uData.filter((value) => value.watchStatus === 3).length;

		data.uncategorized.data = uData;
		_.extend(data.uncategorized.headers, {
			watched: uWatched,
			downloaded: uDownloaded,
			queued: uQueued,
		});

		this.$log.log(data.uncategorized);
		// let categorizedData = filteredData.filter((value) => !!value.releaseYear);
		// let years = {};
		// filteredData.map((value) => {
		// 	if (!value.releaseYear) {

		// 	}
		// });
	}
}
