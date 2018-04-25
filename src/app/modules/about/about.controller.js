import firebase from "firebase";
// import moment from "moment";
// import momentFormat from "moment-duration-format";
import Promise from "bluebird";

export class AboutController {
	constructor($scope, $window) {
		"ngInject";

		this.$scope = $scope;
		this.$window = $window;

		this.activate();
	}

	activate() {
		this.validateUser();
	}

	validateUser() {
		const authValidation = () => new Promise((resolve) => {
			firebase.auth().onAuthStateChanged((isAuthenticated) => {
				if (isAuthenticated) {
					dataRetrieve();
					resolve();
				} else {
					this.$window.location.href = "/login";
				}
			});
		});

		const dataRetrieve = () => new Promise((resolve) => {
			firebase.database()
				.ref("/anime")
				.once("value")
				.then((data) => {
					this.rawData = data.val();

					this.data = {};
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

					this.rawData.map((value) => {
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

					this.$scope.$apply();
					resolve();
				});
		});

		authValidation();
	}
}
