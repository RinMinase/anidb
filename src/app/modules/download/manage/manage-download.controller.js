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
			category: {
				year: null,
				season: null,
			},
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
					this.initializeObject(releaseYear, 0, watchStatus);
					this.data[releaseYear][0][watchStatus].push(data);
					break;
				case "Spring":
					this.initializeObject(releaseYear, 1, watchStatus);
					this.data[releaseYear][1][watchStatus].push(data);
					break;
				case "Summer":
					this.initializeObject(releaseYear, 2, watchStatus);
					this.data[releaseYear][2][watchStatus].push(data);
					break;
				case "Fall":
					this.initializeObject(releaseYear, 3, watchStatus);
					this.data[releaseYear][3][watchStatus].push(data);
					break;
			}
		});

		delete this.data[""];
		delete this.keys[""];
	}

	initializeObject(releaseYear, releaseSeason, watchStatus) {
		if (!this.data[releaseYear][releaseSeason]) {
			this.data[releaseYear][releaseSeason] = {};

			this.keys[releaseYear].push(releaseSeason);
			this.keys[releaseYear].sort((a, b) => a - b);
		}

		if (!this.data[releaseYear][releaseSeason][watchStatus]) {
			this.data[releaseYear][releaseSeason][watchStatus] = [];
		}
	}
}
