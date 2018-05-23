import moment from "moment";

export class AboutController {
	constructor(
		$http,
		$log,
		$scope,
		$state,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$http,
			$log,
			$scope,
			$state,
			firebase,
			data: {},
			dataLoaded: false,
			githubCommits: [],
			githubIssues: [],
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						this.formatData(data);
						this.dataLoaded = true;
						this.$scope.$apply();
					});
			}).catch(() => {
				this.$state.go("login");
			});

		this.$http.get("https://api.github.com/repos/RinMinase/anidb/issues?page=1&per_page=100")
			.then((response) => {
				response.data.map((data) => {
					if (data.state === "open") {
						delete data.assignee;
						delete data.assignees;
						delete data.author_association;
						delete data.closed_at;
						delete data.comments;
						delete data.comments_url;
						delete data.events_url;
						delete data.id;
						delete data.labels_url;
						delete data.locked;
						delete data.milestone;
						delete data.repository_url;
						delete data.state;
						delete data.user;
						delete data.updated_at;
						delete data.url;

						data.dateCreated = moment(new Date(data.created_at))
							.format("MMM DD, YYYY HH:mm");

						delete data.created_at;

						data.labels.map((labels) => {
							delete labels.color;
							delete labels.default;
							delete labels.id;
							delete labels.url;

							labels.class = labels.name.replace(":", "")
								.replace(new RegExp(" ", "g"), "-")
								.toLowerCase();

							labels.name = labels.name.split(" ")[1];
						});

						this.githubIssues.push(data);
					}
				});
			});

		this.$http.get("https://api.github.com/repos/RinMinase/anidb-angular/commits?per_page=20")
			.then((response) => {
				response.data.map((data) => {
					delete data.author;
					delete data.comments_url;
					delete data.commit.author;
					delete data.commit.comment_count;
					delete data.commit.committer;
					delete data.commit.tree;
					delete data.commit.url;
					delete data.commit.verification;
					delete data.committer;
					delete data.parents;
					delete data.sha;
					delete data.url;

					this.githubCommits.push(data);
				});
			});
	}

	formatData(data) {
		this.data.quality = {
			uhd: 0,
			fhd: 0,
			hd: 0,
			hq: 0,
			lq: 0,
		};

		let totalDuration = 0;
		let totalFilesize = 0;
		let totalEpisodes = 0;

		data.map((value) => {

			if (value.watchStatus > 1) {
				return;
			}

			totalDuration += parseInt(value.duration);
			totalFilesize += parseInt(value.filesize);

			if (!isNaN( parseInt(value.episodes) )) {
				totalEpisodes += parseInt(value.episodes);
			}

			if (!isNaN( parseInt(value.ovas) )) {
				totalEpisodes += parseInt(value.ovas);
			}

			if (!isNaN( parseInt(value.specials) )) {
				totalEpisodes += parseInt(value.specials);
			}

			switch (value.quality) {
				case "4K 2160p":
					this.data.quality.uhd++;
					break;
				case "FHD 1080p":
					this.data.quality.fhd++;
					break;
				case "HD 720p":
					this.data.quality.hd++;
					break;
				case "HQ 480p":
					this.data.quality.hq++;
					break;
				case "LQ 360p":
					this.data.quality.lq++;
					break;
			}
		});

		this.data.totalEpisodes = totalEpisodes;
		this.data.totalDays = parseInt(totalDuration / 86400);
		this.data.totalHours = parseInt(totalDuration % 86400 / 3600);
		this.data.totalMinutes = parseInt(totalDuration % 86400 % 3600 / 60);
		this.data.totalSeconds = parseInt(totalDuration % 86400 % 3600 % 60);

		this.data.totalFilesizeGB = parseFloat(totalFilesize / 1073741824).toFixed(2);
		this.data.totalFilesizeTB = parseFloat(totalFilesize / 1099511627776).toFixed(2);
	}
}
