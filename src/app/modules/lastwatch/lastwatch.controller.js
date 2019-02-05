import extend from "lodash/extend";
import moment from "moment-mini";

export class LastWatchController {
	constructor(
		$scope,
		$state,
		firebase
	) {
		"ngInject";

		extend(this, {
			$scope,
			$state,
			firebase,

			data: [],
			dataByDateFinished: [],
			dataByRewatchLast: [],
			dataLoaded: false,
			totalEpisodes: 0,
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve("anime", null, 20, "dateFinished")
					.then((dataDateFinished) => {
						this.firebase.retrieve("anime", null, 20, "rewatchLast")
							.then((dataRewatchLast) => {
								this._formatData(dataDateFinished, dataRewatchLast);
								this.dataLoaded = true;
								this.$scope.$digest();
							});
					});
			}).catch(() => this.$state.go("login"));
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

	_formatData(dataDateFinished, dataRewatchLast) {
		const formattedDataByDate = dataDateFinished.map((value) => {
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
				rewatchLast: value.rewatchLast,
				specials: value.specials,
				title: value.title,
			};

			return formattedValue;
		});

		const formattedDataByRewatch = [];

		dataRewatchLast.forEach((value) => {
			if (value.rewatchLast) {
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
					rewatchLast: value.rewatchLast,
					specials: value.specials,
					title: value.title,
				};

				formattedDataByRewatch.push(formattedValue);
			}
		});

		const filteredData = [];

		formattedDataByDate.forEach((valueByDate, indexByDate) => {
			formattedDataByRewatch.forEach((valueByRewatch, indexByRewatch) => {
				if (valueByDate.title === valueByRewatch.title) {
					formattedDataByRewatch.splice(indexByRewatch, 1);
				}
			});

			filteredData.push(formattedDataByDate[indexByDate]);
		});

		const formattedData = formattedDataByDate.concat(formattedDataByRewatch);
		const sortedData = formattedData.sort(this._sortData).slice(0, 20);

		let dateFirst;
		let dateLast;

		if (sortedData[0].rewatchLast) {
			dateFirst = moment.unix(sortedData[0].rewatchLast);
		} else {
			dateFirst = moment.unix(sortedData[0].dateFinished);
		}

		if (sortedData[sortedData.length - 1].rewatchLast) {
			dateLast = moment.unix(sortedData[sortedData.length - 1].rewatchLast);
		} else {
			dateLast = moment.unix(sortedData[sortedData.length - 1].dateFinished);
		}

		const dateDiffLast = moment().diff(dateLast, "days", true);
		const singleSeason = parseFloat(this.totalEpisodes / 12);

		this.dateFirst = dateFirst.format("MMM DD, YYYY");
		this.dateLast = dateLast.format("MMM DD, YYYY");
		this.daysSinceLastDateCounted = moment().diff(dateLast, "days");
		this.daysSinceLastAnime = moment().diff(dateFirst, "days");
		this.titlesPerWeek = parseFloat((sortedData.length / dateDiffLast) * 7).toFixed(2);
		this.singleSeasonPerWeek = parseFloat((singleSeason / dateDiffLast) * 7).toFixed(2);
		this.episodesPerDay = parseFloat(this.totalEpisodes / dateDiffLast).toFixed(2);
		this.episodesPerWeek = parseFloat(this.episodesPerDay * 7).toFixed(2);

		sortedData.map((value) => {
			if (value.dateFinished === "") {
				value.dateFinished = "-";
			} else {
				value.dateFinished = moment.unix(value.dateFinished).format("MMM DD, YYYY");
			}

			if (value.rewatchLast) {
				value.rewatchLast = moment.unix(value.rewatchLast).format("MMM DD, YYYY");
			}

			this.data.push(value);
		});
	}

	_sortData(a, b) {
		const aDate = a.rewatchLast || a.dateFinished;
		const bDate = b.rewatchLast || b.dateFinished;

		if (aDate < bDate) {
			return 1;
		} else if (aDate > bDate) {
			return -1;
		}

		if (a.title < b.title) {
			return -1;
		} else if (a.title > b.title) {
			return 1;
		}
	}
}
