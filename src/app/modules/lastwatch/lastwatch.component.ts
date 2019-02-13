import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment-mini";

import { FirebaseQueryBuilder } from "@builders/firebase-query.service";
import { FirebaseService } from "@services/firebase.service";

@Component({
	selector: "app-lastwatch",
	templateUrl: "./lastwatch.component.html",
	styleUrls: ["./lastwatch.component.scss"],
})
export class LastwatchComponent implements OnInit {

	data: Array<Object> = [];
	dataLoaded = false;
	stats: any = {};
	totalEpisodes = 0;

	constructor(
		private router: Router,
		private firebaseQueryBuilder: FirebaseQueryBuilder,
		private firebase: FirebaseService,
	) { }

	ngOnInit() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve(
					this.firebaseQueryBuilder.db("anime")
						.limit(20)
						.order("dateFinished", "desc")
						.build(),
				).then((dataDateFinished: Array<any>) => {
						this.firebase.retrieve(
							this.firebaseQueryBuilder.db("anime")
								.limit(20)
								.order("rewatchLast", "desc")
								.build(),
							).then((dataRewatchLast: Array<any>) => {
								this.formatData(dataDateFinished, dataRewatchLast);
								this.dataLoaded = true;
							});
					});
			}).catch(() => this.router.navigateByUrl("/login"));
	}

	private formatData(dataDateFinished: Array<any>, dataRewatchLast: Array<any>) {
		const formattedDataByDate = dataDateFinished.map((value) => {
			if (!isNaN( parseInt(value.episodes, 10) )) {
				this.totalEpisodes += parseInt(value.episodes, 10);
			}

			if (!isNaN( parseInt(value.ovas, 10) )) {
				this.totalEpisodes += parseInt(value.ovas, 10);
			}

			if (!isNaN( parseInt(value.specials, 10) )) {
				this.totalEpisodes += parseInt(value.specials, 10);
			}

			const filesize = this.convertFilesize(value.filesize);
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

		dataRewatchLast.forEach((value: any) => {
			if (value.rewatchLast) {
				if (!isNaN( parseInt(value.episodes, 10) )) {
					this.totalEpisodes += parseInt(value.episodes, 10);
				}

				if (!isNaN( parseInt(value.ovas, 10) )) {
					this.totalEpisodes += parseInt(value.ovas, 10);
				}

				if (!isNaN( parseInt(value.specials, 10) )) {
					this.totalEpisodes += parseInt(value.specials, 10);
				}

				const filesize = this.convertFilesize(value.filesize);
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
		const sortedData = formattedData.sort(this.sortData).slice(0, 20);

		let dateFirst: any;
		let dateLast: any;

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
		const singleSeason = this.stats.totalEpisodes / 12;

		this.stats.totalEpisodes = this.totalEpisodes;
		this.stats.dateFirst = dateFirst.format("MMM DD, YYYY");
		this.stats.dateLast = dateLast.format("MMM DD, YYYY");
		this.stats.daysSinceLastDateCounted = moment().diff(dateLast, "days");
		this.stats.daysSinceLastAnime = moment().diff(dateFirst, "days");
		this.stats.titlesPerWeek = ((sortedData.length / dateDiffLast) * 7).toFixed(2);
		this.stats.singleSeasonPerWeek = ((singleSeason / dateDiffLast) * 7).toFixed(2);
		this.stats.episodesPerDay = (this.stats.totalEpisodes / dateDiffLast).toFixed(2);
		this.stats.episodesPerWeek = (this.stats.episodesPerDay * 7).toFixed(2);

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

	private convertFilesize(filesize: any) {
		filesize = parseFloat(`${filesize}`);

		if (filesize === 0 || filesize === NaN) {
			return "-";
		} else if (filesize < 1073741824) {
			return `${(filesize / 1048576).toFixed(2)} MB`;
		} else {
			return `${(filesize / 1073741824).toFixed(2)} GB`;
		}
	}

	private sortData(a: any, b: any) {
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
