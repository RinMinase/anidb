import moment from "moment";

export class LastWatchController {
	constructor(
		$log,
		$scope,
		$state,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$log,
			$scope,
			$state,
			firebase,
			data: {},
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
						this.data = this.formatData(data);
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

			value.filesize = this._convertFilesize(value.filesize);

			delete value.duration;
			delete value.encoder;
			delete value.firstSeasonTitle;
			delete value.inhdd;
			delete value.offquel;
			delete value.prequel;
			delete value.rating;
			delete value.releaseSeason;
			delete value.releaseYear;
			delete value.remarks;
			delete value.seasonNumber;
			delete value.sequel;
			delete value.watchStatus;

			return value;
		});

		const now = moment();
		const dateFirst = moment(data[0].dateFinished, "X");
		const dateLast = moment(data[data.length - 1].dateFinished, "X");
		const dateDiffLast = now.diff(dateLast, "days", true);

		this.daysSinceLastAnime = now.diff(dateFirst, "days");
		this.titlesPerDay = parseFloat(data.length / dateDiffLast).toFixed(2);
		this.singleSeasonPerDay = parseFloat((this.totalEpisodes / 12) / dateDiffLast).toFixed(2);
		this.episodesPerDay = parseFloat(this.totalEpisodes / dateDiffLast).toFixed(2);

		const sortedData = formattedData.sort((a, b) => {
			const aTitle = a.title;
			const bTitle = b.title;

			if (a.dateFinished < b.dateFinished) {
				return 1;
			}

			if (a.dateFinished > b.dateFinished) {
				return -1;
			}

			if (aTitle < bTitle) {
				return -1;
			}

			if (aTitle > bTitle) {
				return 1;
			}
		});

		return sortedData.map((value) => {
			if (value.dateFinished === "") {
				value.dateFinished = "-";
			} else {
				value.dateFinished = moment(value.dateFinished, "X").format("MMM DD, YYYY");
			}

			return value;
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
}
