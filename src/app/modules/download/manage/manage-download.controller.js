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

	formatData(rawData) {
		rawData.map((data) => {
			const {
				releaseYear,
				releaseSeason,
				watchStatus,
			} = data;

			if (!releaseYear) {
				if (!releaseSeason) {
					if (!this.data[0]) {
						this.data[0] = {0: {}};
					}

					this.data[0][0][watchStatus] = data;
				}
			}

			if (!this.data[releaseYear]) {
				this.data[releaseYear] = {};
			}

			switch (releaseSeason) {
				case "Winter":
					if (!this.data[releaseYear][0]) {
						this.data[releaseYear][0] = {};
					}

					this.data[releaseYear][0][watchStatus] = data;
					break;
				case "Spring":
					if (!this.data[releaseYear][1]) {
						this.data[releaseYear][1] = {};
					}

					this.data[releaseYear][1][watchStatus] = data;
					break;
				case "Summer":
					if (!this.data[releaseYear][2]) {
						this.data[releaseYear][2] = {};
					}

					this.data[releaseYear][2][watchStatus] = data;
					break;
				case "Fall":
					if (!this.data[releaseYear][3]) {
						this.data[releaseYear][3] = {};
					}

					this.data[releaseYear][3][watchStatus] = data;
					break;
			}
		});

		this.$log.log(this.data);
	}
}
