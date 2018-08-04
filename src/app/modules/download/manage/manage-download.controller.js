import addSeasonListDOM from "../add/season/add-season-download.html";
import addTitleDOM from "../add/title/add-title-download.html";

export class ManageDownloadController {
	constructor(
		$scope,
		$state,
		$uibModal,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$scope,
			$state,
			$uibModal,
			firebase,

			category: {
				year: 0,
				season: 0,
			},
			collapse: {
				isCollapsed0: false,
				isCollapsed2: false,
				isCollapsed3: false,
			},
			data: {},
			dataLoaded: false,
			keys: {},
		});

		this.activate();
	}

	activate() {
		// this.firebase.auth()
		// 	.then(() => {
		// 		this.firebase.retrieve()
		// 			.then((data) => {
		// 				this._formatData(data);
		// 				this.dataLoaded = true;
		// 				this.$scope.$digest();
		// 			});
		// 	}).catch(() => {
		// 		this.$state.go("login");
		// 	});


		this.dataLoaded = true;
	}

	addSeasonList() {
		this.$uibModal.open({
			templateUrl: addSeasonListDOM,
			controller: "AddSeasonDownloadController",
			controllerAs: "vm",
			backdrop: "static",
			size: "lg",
		});
	}

	addTitle() {
		this.$uibModal.open({
			templateUrl: addTitleDOM,
			controller: "AddTitleDownloadController",
			controllerAs: "vm",
			backdrop: "static",
			size: "lg",
		});
	}

	_formatData(rawData) {
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
					this._initializeObject(releaseYear, 0, watchStatus);
					this.data[releaseYear][0][watchStatus].push(data);
					break;
				case "Spring":
					this._initializeObject(releaseYear, 1, watchStatus);
					this.data[releaseYear][1][watchStatus].push(data);
					break;
				case "Summer":
					this._initializeObject(releaseYear, 2, watchStatus);
					this.data[releaseYear][2][watchStatus].push(data);
					break;
				case "Fall":
					this._initializeObject(releaseYear, 3, watchStatus);
					this.data[releaseYear][3][watchStatus].push(data);
					break;
			}
		});

		delete this.data[""];
		delete this.keys[""];
	}

	_initializeObject(releaseYear, releaseSeason, watchStatus) {
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
