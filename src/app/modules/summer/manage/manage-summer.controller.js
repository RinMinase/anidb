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
						this.$scope.$apply();
					});
			}).catch(() => {
				this.$state.go("login");
			});
	}

	formatData(summerData, animeData) {
		summerData.forEach((summer, index) => {
			const timeStart = moment.unix(summer.timeStart);
			const timeEnd = moment.unix(summer.timeEnd);

			this.data.push({
				summer: {
					days: timeEnd.diff(timeStart, "days", true),
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
					if (anime.dateFinished >= summer.timeStart
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

			_.extend(this.data[index].summer, {
				episodes: totalEpisodes,
				filesize: this._convertFilesize(totalFilesize),
				quality: {
					uhd: qualityUHD,
					fhd: qualityFHD,
					hd: qualityHD,
					hq: qualityHQ,
					lh: qualityLQ,
				},
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
}
