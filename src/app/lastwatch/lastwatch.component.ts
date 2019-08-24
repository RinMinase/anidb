import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { format, fromUnixTime } from "date-fns";

import { FirebaseQueryBuilder } from "@builders/firebase-query.service";
import { FirebaseService } from "@services/firebase.service";
import { UtilityService } from "@services/utility.service";

@Component({
	selector: "app-lastwatch",
	templateUrl: "./lastwatch.component.html",
	styleUrls: ["./lastwatch.component.scss"],
})
export class LastwatchComponent implements OnInit {

	data: Array<object> = [];
	dataLoaded: boolean = false;
	stats: any = {};
	totalEpisodes = 0;

	dateFormat = "MMM dd, yyyy";

	constructor(
		private router: Router,
		private firebaseQueryBuilder: FirebaseQueryBuilder,
		private firebase: FirebaseService,
		private utility: UtilityService,
	) { }

	ngOnInit() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve(
					this.firebaseQueryBuilder.init()
						.db("anime")
						.limit(20)
						.order("dateFinished", "desc")
						.build(),
				).then((dataDateFinished: Array<any>) => {
						this.firebase.retrieve(
							this.firebaseQueryBuilder.init()
								.db("anime")
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
		const formattedDataByDate = this.formatDataByDate(dataDateFinished);
		const formattedDataByRewatch = this.formatDataByRewatch(dataRewatchLast);

		const formattedData = formattedDataByDate.concat(formattedDataByRewatch);
		const sortedData = formattedData.sort(this.utility.sortByDateThenTitle).slice(0, 20);

		let dateFirst: Date;
		let dateLast: Date;

		if (sortedData[0].rewatchLast) {
			dateFirst = fromUnixTime(sortedData[0].rewatchLast);
		} else {
			dateFirst = fromUnixTime(sortedData[0].dateFinished);
		}

		if (sortedData[sortedData.length - 1].rewatchLast) {
			dateLast = fromUnixTime(sortedData[sortedData.length - 1].rewatchLast);
		} else {
			dateLast = fromUnixTime(sortedData[sortedData.length - 1].dateFinished);
		}

		const oneDay = 24 * 60 * 60 * 1000;
		const dateDiffLast = ((new Date()).getTime() - dateLast.getTime()) / oneDay;
		const singleSeason = this.totalEpisodes / 12;

		this.stats.totalEpisodes = this.totalEpisodes;
		this.stats.dateFirst = format(dateFirst, this.dateFormat);
		this.stats.dateLast = format(dateLast, this.dateFormat);
		this.stats.daysSinceLastDateCounted = format((new Date()).getTime() - dateLast.getTime(), "DDD");
		this.stats.daysSinceLastAnime = format((new Date()).getTime() - dateFirst.getTime(), "DDD");
		this.stats.titlesPerWeek = ((sortedData.length / dateDiffLast) * 7).toFixed(2);
		this.stats.singleSeasonPerWeek = ((singleSeason / dateDiffLast) * 7).toFixed(2);
		this.stats.episodesPerDay = (this.stats.totalEpisodes / dateDiffLast).toFixed(2);
		this.stats.episodesPerWeek = (this.stats.episodesPerDay * 7).toFixed(2);

		sortedData.forEach((value: any) => {
			if (value.dateFinished === "") {
				value.dateFinished = "-";
			} else {
				value.dateFinished = format(fromUnixTime(value.dateFinished), this.dateFormat);
			}

			if (value.rewatchLast) {
				value.rewatchLast = format(fromUnixTime(value.rewatchLast), this.dateFormat);
			}

			this.data.push(value);
		});
	}

	private formatDataByDate(data: any) {
		return data.map((value: any) => {
			if (!isNaN( parseInt(value.episodes) )) {
				this.totalEpisodes += parseInt(value.episodes);
			}

			if (!isNaN( parseInt(value.ovas) )) {
				this.totalEpisodes += parseInt(value.ovas);
			}

			if (!isNaN( parseInt(value.specials) )) {
				this.totalEpisodes += parseInt(value.specials);
			}

			const filesize = this.utility.convertFilesize(value.filesize);

			return {
				dateFinished: value.dateFinished,
				episodes: value.episodes,
				filesize,
				ovas: value.ovas,
				quality: value.quality,
				rewatchLast: value.rewatchLast,
				specials: value.specials,
				title: value.title,
			};
		});
	}

	private formatDataByRewatch(data: any) {
		return data.map((value: any) => {
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

				const filesize = this.utility.convertFilesize(value.filesize);
				return {
					dateFinished: value.dateFinished,
					episodes: value.episodes,
					filesize,
					ovas: value.ovas,
					quality: value.quality,
					rewatchLast: value.rewatchLast,
					specials: value.specials,
					title: value.title,
				};
			}
		});
	}

}
