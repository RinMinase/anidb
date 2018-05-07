export class AboutController {
	constructor(
		$scope,
		$window,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$scope,
			$window,
			firebase,
			data: {},
			dataLoaded: false,
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
				this.$window.location.href = "/login";
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
