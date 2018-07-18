import Fuse from "fuse.js";
import moment from "moment";

import addHomeDOM from "../add/add-home.html";

export class ManageHomeController {
	constructor (
		$anchorScroll,
		$scope,
		$state,
		$stateParams,
		$uibModal,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$anchorScroll,
			$scope,
			$state,
			$stateParams,
			$uibModal,
			firebase,

			data: [],
			unfilteredData: [],
			dataLoaded: false,
			search: "",
			titleList: [],
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

						if (this.$stateParams.id) {
							this.$anchorScroll.yOffset = 55;
							this.$anchorScroll(this.$stateParams.id);
						}
					});
			}).catch(() => {
				this.$state.go("login");
			});

		this.$scope.$watch(
			() => this.search,
			() => {
				if (this.search && this.unfilteredData) {
					const fuseOptions = {
						shouldSort: true,
						threshold: 0.3,
						location: 0,
						distance: 100,
						maxPatternLength: 48,
						minMatchCharLength: 0,
						keys: [
							"title",
							"quality",
							"releaseSeason",
							"releaseYear",
							"encoder",
							"variants",
							"remarks",
						],
					};

					this.data = new Fuse(this.unfilteredData, fuseOptions).search(this.search);
				}
			}
		);
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

		this.data = this.data.sort(this._compareFunction);
		angular.copy(this.data, this.unfilteredData);
	}

	getData() {
		return (this.search) ? this.data : this.unfilteredData;
	}

	_compareFunction(a, b) {
		if (a.quality < b.quality) {
			return -1;
		} else if (a.quality > b.quality) {
			return 1;
		}

		if (a.title < b.title) {
			return -1;
		} else if (a.title > b.title) {
			return 1;
		}
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
