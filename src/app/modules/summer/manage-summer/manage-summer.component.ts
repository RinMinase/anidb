import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment-mini";

import { FirebaseService } from "@services/firebase.service";
import { FirebaseQueryBuilder } from "@builders/firebase-query.service";
import { UtilityService } from "@services/utility.service";

@Component({
	selector: "app-manage-summer",
	templateUrl: "./manage-summer.component.html",
})
export class ManageSummerComponent implements OnInit {

	objKeys = Object.keys;
	data: Array<any> = [];
	dataLoaded: boolean = false;
	category = "0";

	constructor(
		private router: Router,
		private firebase: FirebaseService,
		private firebaseQueryBuilder: FirebaseQueryBuilder,
		private utility: UtilityService,
	) { }

	ngOnInit() {
		let summerData: Array<Object>;
		let animeData: Array<Object>;

		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data: Array<Object>) => {
						animeData = data;
					});
			}).then(() => {
				this.firebase.retrieve(this.firebaseQueryBuilder.db("summer").inhdd(false).build())
					.then((data: Array<Object>) => {
						summerData = data;
						this.formatData(summerData, animeData);
						this.dataLoaded = true;
					});
			}).catch(() => this.router.navigateByUrl("/login"));
	}

	formatData(summerData: Array<any>, animeData: Array<any>) {
		summerData.forEach((summer, index) => {
			const timeStart = moment.unix(summer.timeStart);
			const today = moment().unix();
			let timeEnd = moment.unix(summer.timeEnd);

			if (today < timeEnd.unix()) { timeEnd = moment.unix(today); }

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

			animeData.forEach((anime) => {
				if (anime.inhdd === 1 && anime.watchStatus <= 1) {
					if (anime.rewatch) {
						const rewatch = anime.rewatch.split(",");

						rewatch.forEach((date: string) => {
							const rewatchDate = parseInt(date, 10);

							if (rewatchDate >= summer.timeStart && rewatchDate <= summer.timeEnd) {
								totalFilesize += anime.filesize;
								totalEpisodes += anime.episodes;
								totalEpisodes += anime.ovas;
								totalEpisodes += anime.specials;

								this.data[index].entries.push({
									episodes: anime.episodes,
									filesize: this.utility.convertFilesize(anime.filesize),
									ovas: anime.ovas,
									quality: anime.quality,
									specials: anime.specials,
									title: anime.title,
									dateFinished: moment.unix(rewatchDate).format("MMM DD, YYYY"),
									rewatchFlag: true,
								});

								if (lastDate > rewatchDate) { lastDate = rewatchDate; }

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
							filesize: this.utility.convertFilesize(anime.filesize),
							ovas: anime.ovas,
							quality: anime.quality,
							specials: anime.specials,
							title: anime.title,
							dateFinished: moment.unix(anime.dateFinished).format("MMM DD, YYYY"),
							rewatchFlag: false,
						});

						if (lastDate > anime.dateFinished) { lastDate = anime.dateFinished; }

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
			const sortedEntries = entries.sort(this.sortData);

			this.data[index].entries = sortedEntries;

			const totalTitles = this.data[index].entries.length;
			const titlesPerDay = (totalTitles / days).toFixed(2);
			const episodesPerDay = (totalEpisodes / days).toFixed(2);

			Object.assign(this.data[index].summer, {
				episodes: totalEpisodes,
				episodesPerDay,
				filesize: this.utility.convertFilesize(totalFilesize),
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

		this.invertDataArray();
	}

	private invertDataArray() {
		const sortedData = [this.data.length];
		let index = this.data.length - 1;

		this.data.forEach((data) => {
			sortedData[index--] = data;
		});

		this.data = sortedData;
	}

	private sortData(a: any, b: any) {
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
