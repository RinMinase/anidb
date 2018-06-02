import moment from "moment";

export class AboutController {
	constructor(
		$http,
		$log,
		$scope,
		$state,
		firebase,
		GITHUB_API
	) {
		"ngInject";

		_.extend(this, {
			$http,
			$log,
			$scope,
			$state,
			firebase,
			GITHUB_API,
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

		this.$http.get(this.GITHUB_API.issues)
			.then((response) => {
				response.data.map((data) => {
					if (data.state === "open") {
						const labels = [];
						const date = moment(new Date(data.created_at))
							.format("MMM DD, YYYY HH:mm");

						data.labels.map((label) => {
							const className = label.name.replace(":", "")
								.replace(new RegExp(" ", "g"), "-")
								.toLowerCase();

							labels.push({
								class: className,
								name: label.name.split(" ")[1],
							});
						});

						this.githubIssues.push({
							body: data.body,
							date,
							labels,
							number: data.number,
							title: data.title,
							url: data.html_url,
						});
					}
				});
			});

		this.$http.get(this.GITHUB_API.commits)
			.then((response) => {
				response.data.map((data) => {
					const commitDate = moment(new Date(data.commit.author.date))
						.format("MMM DD, YYYY HH:mm:ss");

					this.githubCommits.push({
						date: commitDate,
						email: data.commit.author.email,
						name: data.commit.author.name,
						message: data.commit.message,
						url: data.html_url,
					});
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
