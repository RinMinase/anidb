import { Component, OnInit } from "@angular/core";
import { format } from "date-fns";

import { GithubService } from "@services/github.service";
import { UtilityService } from "@services/utility.service";

@Component({
	selector: "app-changelog",
	templateUrl: "./changelog.component.html",
	styleUrls: ["./changelog.component.scss"],
})
export class ChangelogComponent implements OnInit {

	githubCommits = [];

	keywords = {
		dep: [ "dependency", "dependencies" ],
		fix: [ "fixed", "removed" ],
		new: [ "added", "functional", "migrated" ],
	};

	constructor(
		private github: GithubService,
		private utility: UtilityService,
	) { }

	ngOnInit() {
		this.github.getCommits().subscribe((response) => {
			const formattedCommits = {};

			response.body.forEach((data: any) => {
				if (data.commit.message.indexOf("Merge branch") === -1) {
					const { date } = data.commit.author;
					const commitDate = `c${format(new Date(date), "YYYYMMDD")}`;
					const title = format(new Date(date), "MMM DD, YYYY");
					const commitData = this.formatCommit(data.commit, data.html_url);
					const { message } = commitData;

					if (!formattedCommits[commitDate]) {
						formattedCommits[commitDate] = { dep: [], fix: [], new: [], improve: [], title };
					}

					const isDep = this.keywords.dep.some((key) => message.indexOf(key) >= 0);
					const isFix = this.keywords.fix.some((key) => message.indexOf(key) >= 0);
					const isNew = this.keywords.new.some((key) => message.indexOf(key) >= 0);

					if (isDep) {
						formattedCommits[commitDate].dep.push(commitData);
					} else if (isFix) {
						formattedCommits[commitDate].fix.push(commitData);
					} else if (isNew) {
						formattedCommits[commitDate].new.push(commitData);
					} else {
						formattedCommits[commitDate].improve.push(commitData);
					}
				}
			});

			Object.keys(formattedCommits).forEach((index) => {
				this.githubCommits.push(formattedCommits[index]);
			});
		});
	}

	private formatCommit(commit: any, url: any) {
		const { date } = commit.author;
		let rawMessage = commit.message.split(":");

		if (rawMessage.length === 1) {
			rawMessage = commit.message.split(new RegExp(" (.+)"));
		}

		if (rawMessage[1].indexOf(", resolved #") !== -1) {
			rawMessage[1] = rawMessage[1].replace(new RegExp(", resolved #[0-9]+", "ig"), "");
		}

		const rawModule = rawMessage[0].trimStart().toLowerCase().replace(new RegExp("_", "g"), " ");
		const module = (rawModule === "anidb" || rawModule === "transition") ? "" : rawModule;
		const message = rawMessage[1].trimStart();

		return {
			date: this.utility.convertDate(date),
			email: commit.author.email,
			name: commit.author.name,
			message,
			module,
			url,
		};
	}

}
