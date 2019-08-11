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
		dep: [ "dependency", "dependencies", "types" ],
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
				if (this.doesNotContainMerge(data.commit.message)) {
					const { date } = data.commit.author;
					const commitDate = `c${format(new Date(date), "YYYYMMDD")}`;
					const title = format(new Date(date), "MMM DD, YYYY");
					const commitData = this.formatCommit(data.commit, data.html_url);
					const { message, module } = commitData;

					if (!formattedCommits[commitDate]) {
						formattedCommits[commitDate] = { dep: [], fix: [], new: [], improve: [], title };
					}

					const isDep = this.parseCommitMessage(message, this.keywords.dep) && module === "";
					const isFix = this.parseCommitMessage(message, this.keywords.fix);
					const isNew = this.parseCommitMessage(message, this.keywords.new);

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

	private parseCommitMessage(message: string, keywords: Array<string>): boolean {
		return keywords.some((key) => message.indexOf(key) >= 0);
	}

	private doesNotContainMerge(message: string) {
		return (message.indexOf("Merge branch") === -1
			|| message.indexOf("Merge pull request") === -1
			|| message.indexOf("renovate.json") === -1);
	}

}
