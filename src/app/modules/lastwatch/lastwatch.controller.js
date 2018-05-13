import _ from "lodash";
import moment from "moment";

export class LastWatchController {
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
				this.firebase.retrieve("anime", null, 20, "dateFinished", true)
					.then((data) => {
						this.data = this.formatData(data);
						this.dataLoaded = true;
						this.$scope.$apply();
					});
			}).catch(() => {
				this.$window.location.href = "/login";
			});
	}

	formatData(data) {
		// const titlesPerDay
		// const singleSeasonPerDay
		// const episodesPerDay

		const now = moment().unix();
		const then = data[0].dateFinished;

		this.daysSinceLastAnime = moment(now - then).format("DDD");

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
				value.dateFinished = moment.unix(value.dateFinished).format("MMM DD, YYYY");
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
