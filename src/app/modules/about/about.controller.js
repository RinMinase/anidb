export class AboutController {
	constructor(
		$log,
		$scope,
		$window,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$log,
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

	retrieveImages() {
		// const imageList = [
		// 	"html",
		// 	"css",
		// 	"js",
		// 	"es6",
		// 	"php",
		// 	"python",
		// 	"c",
		// 	"cpp",
		// 	"java",
		// 	"shell",
		// 	"bs",
		// 	"node",
		// 	"sails",
		// 	"react",
		// 	"angular",
		// 	"ci",
		// 	"laravel",
		// 	"django",
		// 	"apacheisis",
		// 	"docker",
		// 	"strider",
		// 	"apache",
		// 	"nginx",
		// 	"firebase",
		// 	"mysql",
		// 	"mongodb",
		// 	"redis",
		// 	"gulp",
		// ];

		// imageList.map((element) => {});

		this.firebase.retrieveImageUrl("skillsets/html.png").then((url) => {
			this.iconLinks.html = url;
		});

		this.firebase.retrieveImageUrl("skillsets/css.png").then((url) => {
			this.iconLinks.css = url;
		});

		this.firebase.retrieveImageUrl("skillsets/js.png").then((url) => {
			this.iconLinks.js = url;
		});

		this.firebase.retrieveImageUrl("skillsets/es6.png").then((url) => {
			this.iconLinks.es6 = url;
		});

		this.firebase.retrieveImageUrl("skillsets/php.png").then((url) => {
			this.iconLinks.php = url;
		});

		this.firebase.retrieveImageUrl("skillsets/python.png").then((url) => {
			this.iconLinks.python = url;
		});

		this.firebase.retrieveImageUrl("skillsets/c.png").then((url) => {
			this.iconLinks.c = url;
		});

		this.firebase.retrieveImageUrl("skillsets/cpp.png").then((url) => {
			this.iconLinks.cpp = url;
		});

		this.firebase.retrieveImageUrl("skillsets/java.png").then((url) => {
			this.iconLinks.java = url;
		});

		this.firebase.retrieveImageUrl("skillsets/shell.png").then((url) => {
			this.iconLinks.shell = url;
		});

		this.firebase.retrieveImageUrl("skillsets/bs.png").then((url) => {
			this.iconLinks.bs = url;
		});

		this.firebase.retrieveImageUrl("skillsets/node.png").then((url) => {
			this.iconLinks.node = url;
		});

		this.firebase.retrieveImageUrl("skillsets/sails.png").then((url) => {
			this.iconLinks.sails = url;
		});

		this.firebase.retrieveImageUrl("skillsets/react.png").then((url) => {
			this.iconLinks.react = url;
		});

		this.firebase.retrieveImageUrl("skillsets/angular.png").then((url) => {
			this.iconLinks.angular = url;
		});

		this.firebase.retrieveImageUrl("skillsets/ci.png").then((url) => {
			this.iconLinks.ci = url;
		});

		this.firebase.retrieveImageUrl("skillsets/laravel.png").then((url) => {
			this.iconLinks.laravel = url;
		});

		this.firebase.retrieveImageUrl("skillsets/django.png").then((url) => {
			this.iconLinks.django = url;
		});

		this.firebase.retrieveImageUrl("skillsets/apacheisis.png").then((url) => {
			this.iconLinks.apacheisis = url;
		});

		this.firebase.retrieveImageUrl("skillsets/docker.png").then((url) => {
			this.iconLinks.docker = url;
		});

		this.firebase.retrieveImageUrl("skillsets/strider.png").then((url) => {
			this.iconLinks.strider = url;
		});

		this.firebase.retrieveImageUrl("skillsets/apache.png").then((url) => {
			this.iconLinks.apache = url;
		});

		this.firebase.retrieveImageUrl("skillsets/nginx.png").then((url) => {
			this.iconLinks.nginx = url;
		});

		this.firebase.retrieveImageUrl("skillsets/firebase.png").then((url) => {
			this.iconLinks.firebase = url;
		});

		this.firebase.retrieveImageUrl("skillsets/mysql.png").then((url) => {
			this.iconLinks.mysql = url;
		});

		this.firebase.retrieveImageUrl("skillsets/mongodb.png").then((url) => {
			this.iconLinks.mongodb = url;
		});

		this.firebase.retrieveImageUrl("skillsets/redis.png").then((url) => {
			this.iconLinks.redis = url;
		});

		this.firebase.retrieveImageUrl("skillsets/gulp.png").then((url) => {
			this.iconLinks.gulp = url;
		});
	}
}
