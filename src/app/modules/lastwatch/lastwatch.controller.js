import moment from "moment";

export class LastWatchController {
	constructor(
		$scope,
		$state,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$scope,
			$state,
			firebase,

			data: [],
			dataLoaded: false,
			totalEpisodes: 0,
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve("anime", null, 20, "dateFinished", true)
					.then((data) => {
						this.formatData(data);
						this.dataLoaded = true;
						this.$scope.$apply();
					});
			}).catch(() => {
				this.$state.go("login");
			});
	}

	formatData(data) {
		const formattedData = data.map((value) => {
			if (!isNaN( parseInt(value.episodes) )) {
				this.totalEpisodes += parseInt(value.episodes);
			}

			if (!isNaN( parseInt(value.ovas) )) {
				this.totalEpisodes += parseInt(value.ovas);
			}

			if (!isNaN( parseInt(value.specials) )) {
				this.totalEpisodes += parseInt(value.specials);
			}

			const filesize = this._convertFilesize(value.filesize);
			const formattedValue = {
				dateFinished: value.dateFinished,
				episodes: value.episodes,
				filesize,
				ovas: value.ovas,
				quality: value.quality,
				specials: value.specials,
				title: value.title,
			};

			return formattedValue;
		});

		const dateFirst = moment.unix(data[0].dateFinished);
		const dateLast = moment.unix(data[data.length - 1].dateFinished);
		const dateDiffLast = moment().diff(dateLast, "days", true);
		const sortedData = formattedData.sort(this._sortData);

		this.daysSinceLastAnime = moment().diff(dateFirst, "days");
		this.titlesPerDay = parseFloat(data.length / dateDiffLast).toFixed(2);
		this.singleSeasonPerDay = parseFloat((this.totalEpisodes / 12) / dateDiffLast).toFixed(2);
		this.episodesPerDay = parseFloat(this.totalEpisodes / dateDiffLast).toFixed(2);

		sortedData.map((value) => {
			if (value.dateFinished === "") {
				value.dateFinished = "-";
			} else {
				value.dateFinished = moment.unix(value.dateFinished).format("MMM DD, YYYY");
			}

			this.data.push(value);
		});
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

	_sortData(a, b) {
		if (a.dateFinished < b.dateFinished) {
			return 1;
		} else if (a.dateFinished > b.dateFinished) {
			return -1;
		}

		if (a.title < b.title) {
			return -1;
		} else if (a.title > b.title) {
			return 1;
		}
	}
}
