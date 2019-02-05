import extend from "lodash/extend";
import moment from "moment-mini";

export class AboutController {
	constructor(
		$document,
		$scope,
		$state,
		firebase,
		githubApi
	) {
		"ngInject";

		extend(this, {
			$document: $document[0],
			$scope,
			$state,
			firebase,
			githubApi,

			chart: {
				colors: [],
				data: [],
				labels: [],
				series: [],
				options: {},
				datasetOverride: [],
			},
			data: {},
			dataLoaded: false,
			githubCommits: {},
			githubIssues: {0: [], 1: []},
			images: {
				user: "",
			},
			issuesCurrentPage: 1,
			issuesMaxSize: 10,
		});

		this._retrievePackageIssues();
		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						this._formatData(data);
						this.dataLoaded = true;
						this.$scope.$digest();
					});
			}).catch(() => this.$state.go("login"));

		this._getFirebaseImages();
		this._getGithubCommits();
		this._getGithubIssues();

		this._generateChartData();
	}

	_convertDate(date, omitSeconds = false) {
		if (!omitSeconds) {
			return moment(new Date(date))
				.format("MMM DD, YYYY HH:mm:ss");
		} else {
			return moment(new Date(date))
				.format("MMM DD, YYYY HH:mm");
		}
	}

	_element(querySelector) {
		return angular.element(this.$document.querySelectorAll(querySelector));
	}

	_formatData(data) {
		this.chart.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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

			const dateFinished = moment.unix(value.dateFinished);
			const month = dateFinished.month();

			if (month > -1 && month < 12) {
				this.chart.data[month]++;
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

	_generateChartData() {
		this.chart.labels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
		this.chart.series = ["Series A"];
		this.chart.datasetOverride = [{
			yAxisID: "y-axis-1",
		}];

		this.chart.colors = ["#4CAF50"];

		this.chart.options = {
			elements: {
				line: {
					borderColor: "rgb(149, 206, 146)",
					borderWidth: 2,
					fill: false,
					tension: 0.2,
				},
			},
			scales: {
				yAxes: [{
					id: "y-axis-1",
					type: "linear",
					display: true,
					position: "left",
					ticks: {
						suggestedMin: 20,
					},
				}],
			},
		};
	}

	_getFirebaseImages() {
		this.firebase.retrieveImageUrl("/assets/acknowledgements.png")
			.then((url) => {
				this._element(".anidb-about div.acknowledgements")
					.css("background-image", `url(${url})`);
			});

		this.firebase.retrieveImageUrl("/assets/frameworks.png")
			.then((url) => {
				this._element(".anidb-about a.frameworks")
					.css("background-image", `url(${url})`);
			});

		this.firebase.retrieveImageUrl("/assets/platforms.png")
			.then((url) => {
				this._element(".anidb-about a.platforms")
					.css("background-image", `url(${url})`);
			});

		this.firebase.retrieveImageUrl("/assets/user.jpg")
			.then((url) => {
				this.images.user = url;
				// this._element(".anidb-about img.img-user")
				// 	.attr("src", `url(${url})`);
			});
	}

	_getGithubCommits() {
		this.githubApi.getCommits()
			.then((response) => {
				response.data.map((data) => {
					if (data.commit.message.indexOf("Merge branch") === -1) {
						const { date } = data.commit.author;
						let rawMessage = data.commit.message.split(":");

						if (rawMessage.length === 1) {
							rawMessage = data.commit.message.split(new RegExp(" (.+)"));
						}

						if (rawMessage[1].indexOf(", resolved #") !== -1) {
							rawMessage[1] = rawMessage[1].replace(new RegExp(", resolved #[0-9]+", "ig"), "");
						}

						if (typeof String.prototype.trimStart !== "function") {
							String.prototype.trimStart = function() {
								return this.replace(new RegExp("\\s+"), "");
							};
						}

						const rawModule = rawMessage[0]
							.trimStart()
							.toLowerCase()
							.replace(new RegExp("_", "g"), " ");
						const module = (rawModule === "anidb") ? "" : rawModule;
						const message = rawMessage[1].trimStart();
						const commitDate = `c${moment(new Date(date)).format("YYYYMMDD")}`;
						const title = moment(new Date(date)).format("MMM DD, YYYY");
						const commitData = {
							date: this._convertDate(date),
							email: data.commit.author.email,
							name: data.commit.author.name,
							message,
							module,
							url: data.html_url,
						};

						if (!this.githubCommits[commitDate]) {
							this.githubCommits[commitDate] = {
								fix: [],
								new: [],
								improve: [],
								title,
							};
						}

						if (message.indexOf("fixed") !== -1
							|| message.indexOf("removed") !== -1) {
							this.githubCommits[commitDate].fix.push(commitData);
						} else if (message.indexOf("added") !== -1
							|| message.indexOf("functional") !== -1
							|| message.indexOf("migrated") !== -1) {
							this.githubCommits[commitDate].new.push(commitData);
						} else {
							this.githubCommits[commitDate].improve.push(commitData);
						}
					}
				});

				this.$scope.$digest();
			});
	}

	_getGithubIssues() {
		this.githubApi.getIssues()
			.then((response) => {
				response.data.map((data) => {
					if (data.state === "open") {
						const labels = [];

						data.labels.map((label) => {
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

						const { length } = Object.keys(this.githubIssues);

						if (this.githubIssues[length - 1].length === 9) {
							this.githubIssues[length] = [];
							this.issuesMaxSize = length * 10;
						}

						this.githubIssues[length - 1].push({
							body: data.body,
							date: this._convertDate(data.created_at, true),
							labels,
							number: data.number,
							title: data.title,
							url: data.html_url,
						});
					}
				});

				const { length } = Object.keys(this.githubIssues);

				if (!this.githubIssues[length - 1].length) {
					delete this.githubIssues[length - 1];
					this.issuesMaxSize -= 10;
				}

				this.$scope.$digest();
			});
	}

	_retrievePackageIssues() {
		this.packageIssues = [{
			package: "template",
			reason: "-",
			severity: "red",
			version: "0.0.0",
		}];
	}
}
