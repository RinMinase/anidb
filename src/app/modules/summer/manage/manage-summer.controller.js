import moment from "moment";

export class ManageSummerController {
	constructor (
		$scope,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$scope,
			firebase,

			category: 0,
			data: [],
			dataLoaded: false,
		});

		this.activate();
	}

	activate() {
		let summerData;
		let animeData;

		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						animeData = data;
					});
			}).then(() => {
				this.firebase.retrieve("summer")
					.then((data) => {
						summerData = data;
						this.formatData(summerData, animeData);
						this.dataLoaded = true;
						this.$scope.$digest();
					});
			}).catch(() => {
				this.$state.go("login");
			});
	}

	formatData(summerData, animeData) {
		summerData.forEach((summer, index) => {
			const timeStart = moment.unix(summer.timeStart);
			const today = moment().unix();
			let timeEnd = moment.unix(summer.timeEnd);

			if (today < timeEnd) {
				timeEnd = moment.unix(today);
			}

			const days = timeEnd.diff(timeStart, "days");

			this.data.push({
				summer: {
					days,
					end: timeEnd.format("MMM DD, YYYY"),
					start: timeStart.format("MMM DD, YYYY"),
					title: summer.title,
				},
				entries: [],
			});

			let totalEpisodes = 0;
			let totalFilesize = 0;
			let lastDate = 0;
			let qualityUHD = 0;
			let qualityFHD = 0;
			let qualityHD = 0;
			let qualityHQ = 0;
			let qualityLQ = 0;

			animeData.map((anime) => {
				if (anime.inhdd === 1 && anime.watchStatus <= 1) {
					if (anime.rewatch) {
						const rewatch = anime.rewatch.split(",");

						rewatch.forEach((date) => {
							const rewatchDate = parseInt(date);

							if (rewatchDate >= summer.timeStart && rewatchDate <= summer.timeEnd) {
								totalFilesize += anime.filesize;
								totalEpisodes += anime.episodes;
								totalEpisodes += anime.ovas;
								totalEpisodes += anime.specials;

								this.data[index].entries.push({
									episodes: anime.episodes,
									filesize: this._convertFilesize(anime.filesize),
									ovas: anime.ovas,
									quality: anime.quality,
									specials: anime.specials,
									title: anime.title,
									dateFinished: moment.unix(rewatchDate).format("MMM DD, YYYY"),
									rewatchFlag: true,
								});

								if (lastDate > rewatchDate) {
									lastDate = rewatchDate;
								}

								switch (anime.quality) {
									case "4K 2160p":
										qualityUHD++;
										break;
									case "FHD 1080p":
										qualityFHD++;
										break;
									case "HD 720p":
										qualityHD++;
										break;
									case "HQ 480p":
										qualityHQ++;
										break;
									case "LQ 360p":
										qualityLQ++;
										break;
								}
							}
						});
					} else if (anime.dateFinished >= summer.timeStart
						&& anime.dateFinished <= summer.timeEnd) {

						totalFilesize += anime.filesize;
						totalEpisodes += anime.episodes;
						totalEpisodes += anime.ovas;
						totalEpisodes += anime.specials;

						this.data[index].entries.push({
							episodes: anime.episodes,
							filesize: this._convertFilesize(anime.filesize),
							ovas: anime.ovas,
							quality: anime.quality,
							specials: anime.specials,
							title: anime.title,
							dateFinished: moment.unix(anime.dateFinished).format("MMM DD, YYYY"),
							rewatchFlag: false,
						});

						if (lastDate > anime.dateFinished) {
							lastDate = anime.dateFinished;
						}

						switch (anime.quality) {
							case "4K 2160p":
								qualityUHD++;
								break;
							case "FHD 1080p":
								qualityFHD++;
								break;
							case "HD 720p":
								qualityHD++;
								break;
							case "HQ 480p":
								qualityHQ++;
								break;
							case "LQ 360p":
								qualityLQ++;
								break;
						}
					}
				}
			});

			const { entries } = this.data[index];
			const sortedEntries = entries.sort(this._sortData);

			this.data[index].entries = sortedEntries;

			const totalTitles = this.data[index].entries.length;
			const titlesPerDay = (totalTitles / days).toFixed(2);
			const episodesPerDay = (totalEpisodes / days).toFixed(2);

			_.extend(this.data[index].summer, {
				episodes: totalEpisodes,
				episodesPerDay,
				filesize: this._convertFilesize(totalFilesize),
				quality: {
					uhd: qualityUHD,
					fhd: qualityFHD,
					hd: qualityHD,
					hq: qualityHQ,
					lq: qualityLQ,
				},
				titles: totalTitles,
				titlesPerDay,
			});
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
		const aDate = moment(a.dateFinished, "MMM DD, YYYY").valueOf();
		const bDate = moment(b.dateFinished, "MMM DD, YYYY").valueOf();

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
