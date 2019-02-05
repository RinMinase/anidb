import extend from "lodash/extend";
import Fuse from "fuse.js";
import moment from "moment-mini";

import addHomeDOM from "../add/add-home.html";

export class ManageHomeController {
	constructor (
		$anchorScroll,
		$scope,
		$state,
		$stateParams,
		$uibModal,
		firebase,
		fuseOptionsBuilder
	) {
		"ngInject";

		const fuseOptions = fuseOptionsBuilder.init()
			.threshold(0.3)
			.maxPatternLength(48)
			.minMatchCharLength(0)
			.addKeys("title")
			.addKeys("quality")
			.addKeys("releaseSeason")
			.addKeys("releaseYear")
			.addKeys("encoder")
			.addKeys("variants")
			.addKeys("remarks")
			.build();

		extend(this, {
			$anchorScroll,
			$scope,
			$state,
			$stateParams,
			$uibModal,
			firebase,

			data: [],
			dataLoaded: false,
			fuseOptions,
			search: $stateParams.search || "",
			titleList: [],
			pristineData: [],
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
			}).catch(() => this.$state.go("login"));

		this.$scope.$watch(
			() => this.search,
			() => {
				if (this.search && this.pristineData) {
					this.data = new Fuse(this.pristineData, this.fuseOptions).search(this.search);
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
		data.map((value) => {
			if (value.watchStatus <= 1) {
				const filesize = this._convertFilesize(value.filesize);
				let dateFinished;

				if (!value.rewatchLast) {
					dateFinished = moment.unix(value.dateFinished).format("MMM DD, YYYY");
				} else {
					dateFinished = moment.unix(value.rewatchLast).format("MMM DD, YYYY");
				}

				this.titleList.push(value.title);
				this.data.push({
					dateFinished,
					encoder: value.encoder,
					episodes: value.episodes,
					filesize,
					id: value.id,
					ovas: value.ovas,
					quality: value.quality,
					releaseSeason: value.releaseSeason,
					releaseYear: value.releaseYear,
					rewatchCount: value.rewatchCount,
					specials: value.specials,
					title: value.title,
				});
			}
		});

		this.data = this.data.sort(this._compareFunction);
		angular.copy(this.data, this.pristineData);

		if (this.search) {
			this.data = new Fuse(this.pristineData, this.fuseOptions).search(this.search);
		}
	}

	getData() {
		return (this.search) ? this.data : this.pristineData;
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
