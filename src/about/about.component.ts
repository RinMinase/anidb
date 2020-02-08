import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { getMonth, fromUnixTime } from "date-fns";

import { FirebaseService } from "@services/firebase.service";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {
	userImage: string;
	dataLoaded = false;

	totalEpisodes: number;
	totalSeasons: number = 0;
	totalTitles: number = 0;
	totalFilesizeGB: string;
	totalFilesizeTB: string;

	totalDuration = { days: null, hours: null, minutes: null, seconds: null };
	totalRewatchDuration = {
		days: null,
		hours: null,
		minutes: null,
		seconds: null,
	};
	quality = { uhd: 0, fhd: 0, hd: 0, hq: 0, lq: 0 };

	chart = {
		data: [
			{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Titles per Month" },
		],
		colors: [
			{
				borderColor: "rgba(149, 206, 146, 1)",
				pointBackgroundColor: "rgba(76, 175, 80, 1)",
				pointBorderColor: "rgba(220, 220, 220, 0.3)",
				borderWidth: 2.3,
				fill: false,
				tension: 0,
			},
		],
		labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
		options: {
			responsive: true,
		},
	};

	constructor(private router: Router, private firebase: FirebaseService) {}

	ngOnInit() {
		this.firebase
			.auth()
			.then(() => {
				this.firebase.retrieve().then((data: Array<any>) => {
					this.formatData(data);
					this.dataLoaded = true;
				});
			})
			.catch(() => this.router.navigateByUrl("/login"));

		this.getFirebaseImages();
	}

	private formatData(data: Array<any>) {
		let totalDuration = 0;
		let totalRewatchDuration = 0;
		let totalFilesize = 0;
		let totalEpisodes = 0;

		data.forEach((value: any) => {
			if (value.watchStatus > 1) {
				return;
			}

			const month = getMonth(fromUnixTime(value.dateFinished));
			if (month > -1 && month < 12) {
				this.chart.data[0].data[month]++;
			}

			totalDuration += parseInt(value.duration);
			totalFilesize += parseInt(value.filesize);

			if (value.rewatchLast && value.rewatch.split(",").length) {
				totalRewatchDuration +=
					parseInt(value.duration) * (value.rewatch.split(",").length + 1);
			} else {
				totalRewatchDuration += parseInt(value.duration);
			}

			if (!isNaN(parseInt(value.episodes))) {
				totalEpisodes += parseInt(value.episodes);
			}
			if (!isNaN(parseInt(value.ovas))) {
				totalEpisodes += parseInt(value.ovas);
			}
			if (!isNaN(parseInt(value.specials))) {
				totalEpisodes += parseInt(value.specials);
			}

			this.parseSeasonNumber(value.seasonNumber);
			this.parseQuality(value.quality);
		});

		this.totalEpisodes = totalEpisodes;
		this.totalDuration = this.parseTotalDuration(totalDuration);
		this.totalRewatchDuration = this.parseTotalDuration(totalRewatchDuration);

		this.totalFilesizeGB = (totalFilesize / 1073741824).toFixed(2);
		this.totalFilesizeTB = (totalFilesize / 1099511627776).toFixed(2);
	}

	private parseQuality(quality: string) {
		switch (quality) {
			case "4K 2160p":
				this.quality.uhd++;
				break;
			case "FHD 1080p":
				this.quality.fhd++;
				break;
			case "HD 720p":
				this.quality.hd++;
				break;
			case "HQ 480p":
				this.quality.hq++;
				break;
			case "LQ 360p":
				this.quality.lq++;
				break;
		}
	}

	private parseSeasonNumber(seasonNumber: any) {
		if (!isNaN(parseInt(seasonNumber))) {
			if (seasonNumber === 1) {
				this.totalSeasons++;
			}

			this.totalTitles++;
		}
	}

	private parseTotalDuration(duration: number) {
		const days = (duration / 86400).toFixed(0);
		const hours = ((duration % 86400) / 3600).toFixed(0);
		const minutes = (((duration % 86400) % 3600) / 60).toFixed(0);
		const seconds = (((duration % 86400) % 3600) % 60).toFixed(0);

		return { days, hours, minutes, seconds };
	}

	private getFirebaseImages() {
		this.firebase
			.retrieveImageUrl("/assets/acknowledgements.png")
			.then((url) => {
				this.element("div.acknowledgements").forEach((element) => {
					element.style.backgroundImage = `url(${url})`;
				});
			});

		this.firebase.retrieveImageUrl("/assets/platforms.png").then((url) => {
			this.element("a.platforms").forEach((element) => {
				element.style.backgroundImage = `url(${url})`;
			});
		});

		this.firebase.retrieveImageUrl("/assets/user.jpg").then((url) => {
			this.userImage = url as string;
		});
	}

	private element(querySelector: string) {
		return (window.document.querySelectorAll(
			querySelector,
		) as unknown) as Array<HTMLElement>;
	}
}
