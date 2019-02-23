import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment-mini";

import { FirebaseService } from "@services/firebase.service";
import { GithubService } from "@services/github.service";

import transitionProgress from "src/assets/transition-progress.json";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {

	userImage: string;
	dataLoaded = false;

	totalEpisodes: number;
	totalFilesizeGB: string;
	totalFilesizeTB: string;

	totalDuration = { days: null, hours: null, minutes: null, seconds: null };
	quality = { uhd: 0, fhd: 0, hd: 0, hq: 0, lq: 0 };

	chart = {
		data: [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: "Series A" }],
		colors: [],
		labels: [],
		options: {},
	};

	githubIssues = [];
	packageIssues: Object[];
	transitionProgress = transitionProgress;

	constructor(
		private router: Router,
		private firebase: FirebaseService,
		private github: GithubService,
	) { }


	ngOnInit() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
				.then((data: Array<any>) => {
					this.formatData(data);
					this.dataLoaded = true;
				});
		}).catch(() => this.router.navigateByUrl("/login"));

		this.getFirebaseImages();
		this.getGithubIssues();
		this.getPackageIssues();
		this.generateChartData();
		this.generateTransitionProgress();
	}

	private formatData(data: Array<any>) {
		let totalDuration = 0;
		let totalFilesize = 0;
		let totalEpisodes = 0;

		data.map((value: any) => {

			if (value.watchStatus > 1) { return; }

			const month = moment.unix(value.dateFinished).month();
			if (month > -1 && month < 12) {
				this.chart.data[0].data[month]++;
			}

			totalDuration += parseInt(value.duration, 10);
			totalFilesize += parseInt(value.filesize, 10);

			if (!isNaN( parseInt(value.episodes, 10) )) {
				totalEpisodes += parseInt(value.episodes, 10);
			}

			if (!isNaN( parseInt(value.ovas, 10) )) {
				totalEpisodes += parseInt(value.ovas, 10);
			}

			if (!isNaN( parseInt(value.specials, 10) )) {
				totalEpisodes += parseInt(value.specials, 10);
			}

			switch (value.quality) {
				case "4K 2160p": this.quality.uhd++; break;
				case "FHD 1080p": this.quality.fhd++; break;
				case "HD 720p": this.quality.hd++; break;
				case "HQ 480p": this.quality.hq++; break;
				case "LQ 360p": this.quality.lq++; break;
			}
		});

		this.totalEpisodes = totalEpisodes;
		this.totalDuration.days = (totalDuration / 86400).toFixed(0);
		this.totalDuration.hours = (totalDuration % 86400 / 3600).toFixed(0);
		this.totalDuration.minutes = (totalDuration % 86400 % 3600 / 60).toFixed(0);
		this.totalDuration.seconds = (totalDuration % 86400 % 3600 % 60).toFixed(0);

		this.totalFilesizeGB = (totalFilesize / 1073741824).toFixed(2);
		this.totalFilesizeTB = (totalFilesize / 1099511627776).toFixed(2);
	}

	private getFirebaseImages() {
		this.firebase.retrieveImageUrl("/assets/acknowledgements.png")
			.then((url) => {
				this.element("div.acknowledgements")
					.forEach(element => { element.style.backgroundImage = `url(${url})`; });
			});

		this.firebase.retrieveImageUrl("/assets/platforms.png")
			.then((url) => {
				this.element("a.platforms")
					.forEach(element => { element.style.backgroundImage = `url(${url})`; });
			});

		this.firebase.retrieveImageUrl("/assets/user.jpg")
			.then((url) => { this.userImage = url as string; });
	}

	private getGithubIssues() {
		this.github.getIssues()
			.subscribe((response) => {
				response.body.map((data: any) => {
					if (data.state === "open") {
						const labels = [];

						data.labels.map((label: any) => {
							if (!(label.name === "to do" || label.name === "in progress")) {
								const className = label.name.replace(":", "")
									.replace(new RegExp(" ", "g"), "-")
									.toLowerCase();

								labels.push({
									class: className,
									name: label.name.split(" ")[1].toUpperCase(),
								});
							}
						});

						labels.reverse();

						this.githubIssues.push({
							body: data.body,
							date: this.convertDate(data.created_at, true),
							labels,
							number: data.number,
							title: data.title,
							url: data.html_url,
						});
					}
				});
			});
	}

	private getPackageIssues() {
		this.packageIssues = [{
			package: "template",
			reason: "-",
			severity: "red",
			version: "0.0.0",
		}];
	}

	private generateChartData() {
		this.chart.labels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

		this.chart.colors = [{
			borderColor: "rgba(149, 206, 146, 1)",
			pointBackgroundColor: "rgba(76, 175, 80, 1)",
			pointBorderColor: "rgba(220, 220, 220, 0.3)",
			borderWidth: 2.3,
			fill: false,
			tension: 0.2,
		}];

		this.chart.options = {
			responsive: true,
		};
	}

	private generateTransitionProgress() {
		Object.keys(this.transitionProgress).forEach((key) => {
			Object.keys(this.transitionProgress[key]).forEach((subkey) => {

				let subkeyTotal = 0;
				let subkeyFinished = 0;

				this.transitionProgress[key][subkey].forEach((subElement: any) => {
					subkeyTotal += subElement.points;
					if (subElement.status === true) { subkeyFinished += subElement.points; }
				});

				const subkeyPercentage = ((subkeyFinished / subkeyTotal) * 100).toFixed(2);
				this.transitionProgress[key][subkey].unshift(subkeyPercentage);

			});
		});
	}

	private convertDate(date: string, omitSeconds = false) {
		if (!omitSeconds) {
			return moment(new Date(date))
				.format("MMM DD, YYYY HH:mm:ss");
		} else {
			return moment(new Date(date))
				.format("MMM DD, YYYY HH:mm");
		}
	}

	private element(querySelector: string) {
		return window.document.querySelectorAll(querySelector) as unknown as Array<HTMLElement>;
	}

}
