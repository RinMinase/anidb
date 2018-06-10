// import Fuse from "fuse.js";
import moment from "moment";

import addHomeDOM from "ngtemplate!html!../add/add-home.html";

export class ManageHomeController {
	constructor (
		$location,
		$log,
		$scope,
		$state,
		$uibModal,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$location,
			$log,
			$scope,
			$state,
			$uibModal,
			firebase,
			dataLoaded: false,
			titleList: [],
		});

		_.extend(this.$scope, {
			search: "",
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
				this.$state.go("login");
			});

		// this.$scope.$watch(
		// 	() => this.$scope.search,
		// 	() => {
		//
		// 		if (this.data) {
		// 			const fuseOptions = {
		// 				shouldSort: true,
		// 				threshold: 0.3,
		// 				location: 0,
		// 				distance: 100,
		// 				maxPatternLength: 64,
		// 				minMatchCharLength: 0,
		// 				keys: [
		// 					"title",
		// 					// "quality",
		// 					// "releaseSeason",
		// 					// "releaseYear",
		// 					// "encoder",
		// 					// "variants",
		// 					// "remarks",
		// 				],
		// 			};
		//
		// 			this.filteredData = new Fuse(this.data, fuseOptions)
		// 				.search(this.$scope.search);
		// 		// } else if (this.data) {
		// 		// 	this.filteredData = this.data.map((data) => Object.create(data));
		// 		// 	this.data = angular.copy(this.unsearchedData);
		// 		}
		//
		// 	}
		// );
	}

	formatData(data) {
		const dataKeys = Object.keys(data);

		return data.map((value, index) => {
			if (value.watchStatus > 1) {
				return;
			}

			this.titleList.push(value.title);
			value.filesize = this._convertFilesize(value.filesize);
			value.dateFinished = moment.unix(value.dateFinished).format("MMM DD, YYYY");
			value.id = dataKeys[index];

			delete value.duration;
			delete value.firstSeasonTitle;
			delete value.inhdd;
			delete value.offquel;
			delete value.prequel;
			delete value.rating;
			delete value.seasonNumber;
			delete value.sequel;
			delete value.watchStatus;

			return value;
		});
	}

	addTitle() {
		this.$uibModal.open({
			templateUrl: addHomeDOM,
			controller: "AddHomeController",
			controllerAs: "vm",
			backdrop: "static",
			resolve: {
				titleList: () => this.titleList,
			},
		});
	}

	view(id) {
		this.$location.path(`/view/${id}`);
	}

	_convertFilesize(filesize) {
		filesize = parseFloat(filesize);

		if (filesize === 0) {
			return "-";
		} else if (filesize < 1073741824) {
			return `${(filesize / 1048576).toFixed(2)} MB`;
		} else {
			return `${(filesize / 1073741824).toFixed(2)} GB`;
		}
	}
}
