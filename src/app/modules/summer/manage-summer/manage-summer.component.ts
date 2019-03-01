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

	totalEpisodes: number;
	totalFilesize: number;
	quality: any;

	dateFormat = "MMM DD, YYYY";

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
					end: timeEnd.format(this.dateFormat),
					start: timeStart.format(this.dateFormat),
					title: summer.title,
				},
				entries: [],
			});

			this.processData(animeData, summer, index);

			const { entries } = this.data[index];
			const sortedEntries = entries.sort(this.utility.sortByDateStringThenTitle);

			this.data[index].entries = sortedEntries;

			const totalTitles = this.data[index].entries.length;
			const titlesPerDay = (totalTitles / days).toFixed(2);
			const episodesPerDay = (this.totalEpisodes / days).toFixed(2);

			Object.assign(this.data[index].summer, {
				episodes: this.totalEpisodes,
				episodesPerDay,
				filesize: this.utility.convertFilesize(this.totalFilesize),
				quality: this.quality,
				titles: totalTitles,
				titlesPerDay,
			});
		});

		this.invertDataArray();
	}

	private invertDataArray() {
		const sortedData = [this.data.length];
		let index = this.data.length - 1;

		this.data.forEach((data) => { sortedData[index--] = data; });
		this.data = sortedData;
	}

	private processData(animeData: any, summer: any, index: number) {
		this.totalEpisodes = 0;
		this.totalFilesize = 0;
		this.quality = { uhd: 0, fhd: 0, hd: 0, hq: 0, lq: 0 };

		animeData.forEach((anime: any) => {
			if (anime.watchStatus <= 1) {
				const isWithinTimeBoundary = anime.dateFinished >= summer.timeStart
					&& anime.dateFinished <= summer.timeEnd;

				if (anime.rewatch) {
					this.processRewatch(summer, anime, index);
				} else if (isWithinTimeBoundary) {
					this.totalFilesize += anime.filesize;
					this.totalEpisodes += anime.episodes;
					this.totalEpisodes += anime.ovas;
					this.totalEpisodes += anime.specials;

					this.pushToEntries(anime, index, false);
					this.processQuality(anime.quality);
				}
			}
		});
	}

	private processQuality(quality: any) {
		if (quality === "4K 2160p") { this.quality.uhd++; }
		if (quality === "FHD 1080p") { this.quality.fhd++; }
		if (quality === "HD 720p") { this.quality.hd++; }
		if (quality === "HQ 480p") { this.quality.hq++; }
		if (quality === "LQ 360p") { this.quality.lq++; }
	}

	private processRewatch(summer: any, anime: any, index: any) {
		const rewatch = anime.rewatch.split(",");

		rewatch.forEach((date: string) => {
			const rewatchDate = parseInt(date, 10);

			if (rewatchDate >= summer.timeStart && rewatchDate <= summer.timeEnd) {
				this.totalFilesize += anime.filesize;
				this.totalEpisodes += anime.episodes;
				this.totalEpisodes += anime.ovas;
				this.totalEpisodes += anime.specials;

				this.pushToEntries(anime, index, true, rewatchDate);
				this.processQuality(anime.quality);
			}
		});
	}

	private pushToEntries(anime: any, index: number, rewatchFlag: boolean, rewatchDate?: any) {
		this.data[index].entries.push({
			episodes: anime.episodes,
			filesize: this.utility.convertFilesize(anime.filesize),
			ovas: anime.ovas,
			quality: anime.quality,
			specials: anime.specials,
			title: anime.title,
			dateFinished: moment.unix(rewatchDate || anime.dateFinished).format(this.dateFormat),
			rewatchFlag,
		});
	}

}
