// import Fuse from "fuse.js";
import moment from "moment";

import addHomeDOM from "../add/add-home.html";

export class ManageHomeController {
	constructor (
		$location,
		$scope,
		$state,
		$uibModal,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$location,
			$scope,
			$state,
			$uibModal,
			firebase,

			data: [],
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
						this.formatData(data);
						this.dataLoaded = true;
						this.$scope.$digest();
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

		data.map((value, index) => {
			if (value.watchStatus <= 1) {
				const filesize = this._convertFilesize(value.filesize);
				const dateFinished = moment.unix(value.dateFinished).format("MMM DD, YYYY");
				const id = dataKeys[index];

				this.titleList.push(value.title);
				this.data.push({
					dateFinished,
					encoder: value.encoder,
					episodes: value.episodes,
					filesize,
					id,
					ovas: value.ovas,
					quality: value.quality,
					releaseSeason: value.releaseSeason,
					releaseYear: value.releaseYear,
					specials: value.specials,
					title: value.title,
				});
			}
		});
	}

	addTitle() {
		this.$uibModal.open({
			templateUrl: addHomeDOM,
			controller: "AddHomeController",
			controllerAs: "vm",
			backdrop: "static",
			size: "lg",
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
