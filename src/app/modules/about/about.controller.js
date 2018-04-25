import firebase from "firebase";
// import moment from "moment";
// import momentFormat from "moment-duration-format";
import Promise from "bluebird";

export class AboutController {
	constructor() {
		"ngInject";

		this.$scope = $scope;

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

					this.data.quality = {
						uhd: 0,
						fhd: 0,
						hd: 0,
						hq: 0,
						lq: 0,
					};

					let totalDuration = 0;
					let totalFilesize = 0;

					this.rawData.map((value) => {
						totalDuration += parseInt(value.duration);
						totalFilesize += parseInt(value.filesize);
						this.data.totalEpisodes += parseInt(value.episodes)
							+ parseInt(value.ovas)
							+ parseInt(value.specials);

						switch (value.quality) {
						case "4k 2160p":
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

					this.data.totalDays = totalDuration / 86400;
					this.data.totalHours = totalDuration % 86400 / 3600;
					this.data.totalMinutes = totalDuration % 86400 % 3600 / 60;
					this.data.totalSeconds = totalDuration % 86400 % 3600 % 60;

					this.data.totalFilesizeGB = totalFilesize / 1024 / 1024 / 1024;
					this.data.totalFilesizeTB = totalFilesize / 1024 / 1024 / 1024 / 1024;

					this.$scope.$apply();
					resolve();
				});
		});

		authValidation();
	}
}
