import { Component, OnInit } from "@angular/core";

import { GithubService } from "@services/github.service";
import { UtilityService } from "@services/utility.service";

@Component({
	selector: "app-issues",
	templateUrl: "./issues.component.html",
	styleUrls: ["./issues.component.scss"],
})
export class IssuesComponent implements OnInit {

	pageSize = 10;
	page = 1;

	githubIssues = [];
	packageIssues: Object[];

	constructor(
		private github: GithubService,
		private utility: UtilityService,
	) { }

	ngOnInit() {
		this.getGithubIssues();
		this.getPackageIssues();
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
							date: this.utility.convertDate(data.created_at, true),
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
		}, {
			package: "codelyzer",
			reason: "Still in beta stages",
			severity: "green",
			version: "5.0.0-beta.1",
		}, {
			package: "typescript",
			reason: "Angular 7 only supports typescript versions below 3.3",
			severity: "orange",
			version: "3.3.3333",
		}, {
			package: "webpack",
			reason: "Angular 7 builder only supports webpack version 4.29.0",
			severity: "green",
			version: "4.29.6",
		}];
	}

}
