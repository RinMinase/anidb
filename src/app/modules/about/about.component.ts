import { Component, OnInit } from "@angular/core";
import * as moment from "moment-mini";

import { FirebaseNewService } from "@services/firebase-new.service";
import { GithubService } from "@services/github.service";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {

	userImage: string;
	dataLoaded = false;
	pageSize = 10;
	page = 1;

	githubCommits = [];
	githubIssues = [];
	packageIssues: Object[];

	constructor(
		private firebase: FirebaseNewService,
		private github: GithubService,
	) { }

	ngOnInit() {
		this.getFirebaseImages();
		this.getGithubCommits();
		this.getGithubIssues();
		this.getPackageIssues();
	}

	private getFirebaseImages() {
		this.firebase.retrieveImageUrl("/assets/acknowledgements.png")
			.then((url) => {
				this.element(".anidb-about div.acknowledgements")
					.forEach(element => { element.style.backgroundImage = `url(${url})`; });
			});

		this.firebase.retrieveImageUrl("/assets/frameworks.png")
			.then((url) => {
				this.element(".anidb-about a.frameworks")
					.forEach(element => { element.style.backgroundImage = `url(${url})`; });
			});

		this.firebase.retrieveImageUrl("/assets/platforms.png")
			.then((url) => {
				this.element(".anidb-about a.platforms")
					.forEach(element => { element.style.backgroundImage = `url(${url})`; });
			});

		this.firebase.retrieveImageUrl("/assets/user.jpg")
			.then((url) => { this.userImage = url as string; });
	}

	private getGithubCommits() {
		this.github.getCommits()
			.subscribe((response) => {
				const formattedCommits = {};

				response.body.map((data: any) => {
					if (data.commit.message.indexOf("Merge branch") === -1) {
						const { date } = data.commit.author;
						let rawMessage = data.commit.message.split(":");

						if (rawMessage.length === 1) {
							rawMessage = data.commit.message.split(new RegExp(" (.+)"));
						}

						if (rawMessage[1].indexOf(", resolved #") !== -1) {
							rawMessage[1] = rawMessage[1].replace(new RegExp(", resolved #[0-9]+", "ig"), "");
						}

						const rawModule = rawMessage[0]
							.trimStart()
							.toLowerCase()
							.replace(new RegExp("_", "g"), " ");
						const module = (rawModule === "anidb" || rawModule === "transition") ? "" : rawModule;
						const message = rawMessage[1].trimStart();
						const commitDate = `c${moment(new Date(date)).format("YYYYMMDD")}`;
						const title = moment(new Date(date)).format("MMM DD, YYYY");
						const commitData = {
							date: this.convertDate(date),
							email: data.commit.author.email,
							name: data.commit.author.name,
							message,
							module,
							url: data.html_url,
						};

						if (!formattedCommits[commitDate]) {
							formattedCommits[commitDate] = {
								fix: [],
								new: [],
								improve: [],
								title,
							};
						}

						if (message.indexOf("fixed") !== -1
							|| message.indexOf("removed") !== -1) {
								formattedCommits[commitDate].fix.push(commitData);
						} else if (message.indexOf("added") !== -1
							|| message.indexOf("functional") !== -1
							|| message.indexOf("migrated") !== -1) {
								formattedCommits[commitDate].new.push(commitData);
						} else {
							formattedCommits[commitDate].improve.push(commitData);
						}
					}
				});

				Object.keys(formattedCommits).map((index) => {
					this.githubCommits.push(formattedCommits[index]);
				});
			});
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
