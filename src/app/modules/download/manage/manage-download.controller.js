import _ from "lodash";

export class ManageDownloadController {
	constructor(
		$log,
		$scope,
		$stateParams,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$log,
			$scope,
			$stateParams,
			firebase,
			data: {},
			dataLoaded: false,
			keys: {},
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						this.formatData(data);
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

					if (!this.data[0][0][watchStatus]) {
						this.data[0][0][watchStatus] = [];
					}

					this.data[0][0][watchStatus].push(data);
				}
			}

			if (!this.data[releaseYear]) {
				this.data[releaseYear] = {};
				this.keys[releaseYear] = [];
			}

			switch (releaseSeason) {
				case "Winter":
					if (!this.data[releaseYear][0]) {
						this.data[releaseYear][0] = {};
						this.keys[releaseYear].push(0);
						this.keys[releaseYear].sort((a, b) => a - b);
					}

					if (!this.data[releaseYear][0][watchStatus]) {
						this.data[releaseYear][0][watchStatus] = [];
					}

					this.data[releaseYear][0][watchStatus].push(data);
					break;
				case "Spring":
					if (!this.data[releaseYear][1]) {
						this.data[releaseYear][1] = {};
						this.keys[releaseYear].push(1);
						this.keys[releaseYear].sort((a, b) => a - b);
					}

					if (!this.data[releaseYear][1][watchStatus]) {
						this.data[releaseYear][1][watchStatus] = [];
					}

					this.data[releaseYear][1][watchStatus].push(data);
					break;
				case "Summer":
					if (!this.data[releaseYear][2]) {
						this.data[releaseYear][2] = {};
						this.keys[releaseYear].push(2);
						this.keys[releaseYear].sort((a, b) => a - b);
					}

					if (!this.data[releaseYear][2][watchStatus]) {
						this.data[releaseYear][2][watchStatus] = [];
					}

					this.data[releaseYear][2][watchStatus].push(data);
					break;
				case "Fall":
					if (!this.data[releaseYear][3]) {
						this.data[releaseYear][3] = {};
						this.keys[releaseYear].push(3);
						this.keys[releaseYear].sort((a, b) => a - b);
					}

					if (!this.data[releaseYear][3][watchStatus]) {
						this.data[releaseYear][3][watchStatus] = [];
					}

					this.data[releaseYear][3][watchStatus].push(data);
					break;
			}
		});

		delete this.data[""];
		delete this.keys[""];
	}
}
