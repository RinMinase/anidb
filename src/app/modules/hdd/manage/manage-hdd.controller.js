export class ManageHddController {
	constructor (
		$scope,
		firebase
	) {
		"ngInject";

		_.extend(this, {
			$scope,
			firebase,

			collapse: [],
			data: [],
			dataLoaded: false,
		});

		this.activate();
	}

	activate() {
		let hddData;
		let animeData;

		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						animeData = data;
					});
			}).then(() => {
				this.firebase.retrieve("hdd")
					.then((data) => {
						hddData = data;
						this.formatData(hddData, animeData);
						this.dataLoaded = true;
						this.$scope.$digest();
					});
			}).catch(() => {
				this.$state.go("login");
			});
	}

	formatData(hddData, animeData) {
		hddData.forEach((hdd, index) => {
			const size = parseFloat(hdd.size / 1073741824).toFixed(2);
			let totalSize = 0;

			this.data.push({
				hdd: {
					from: hdd.from.toUpperCase(),
					to: hdd.to.toUpperCase(),
					total: `${size} GB`,
				},
				entries: [],
			});

			animeData.map((anime) => {
				if (anime.inhdd === 1) {
					const firstLetter = anime.title.charAt(0).toUpperCase();
					const from = hdd.from.toUpperCase().charCodeAt();
					const to = hdd.to.toUpperCase().charCodeAt();
					const ranges = [];

					for (let i = 65; i <= 90; i++) {
						if (i >= from && i <= to) {
							ranges.push(String.fromCharCode(i));
						}
					}

					ranges.some((letter) => {
						if (letter === "A"
							&& firstLetter.charCodeAt() >= 48
							&& firstLetter.charCodeAt() <= 57) {

							this.data[index].entries.push({
								filesize: this._convertFilesize(anime.filesize),
								quality: anime.quality,
								title: anime.title,
							});
							totalSize += anime.filesize;

							return;
						} else if (firstLetter === letter) {
							this.data[index].entries.push({
								filesize: this._convertFilesize(anime.filesize),
								quality: anime.quality,
								title: anime.title,
							});
							totalSize += anime.filesize;

							return;
						}
					});
				}
			});

			this.data.map((data) => {
				data.entries.sort(this._compareFunction);

				return data;
			});

			const free = parseFloat((hdd.size - totalSize) / 1073741824).toFixed(2);
			const used = parseFloat(totalSize / 1073741824).toFixed(2);
			const titles = this.data[index].entries.length;
			const percent = parseInt((totalSize / hdd.size) * 100);
			let percentType;

			if (percent >= 0 && percent < 80) {
				percentType = "success";
			} else if (percent >= 80 && percent < 90) {
				percentType = "warning";
			} else {
				percentType = "danger";
			}

			this.collapse.push(false);

			_.extend(this.data[index].hdd, {
				free: `${free} GB`,
				panel: this.collapse.length,
				percent,
				percentType,
				titles,
				used: `${used} GB`,
			});
		});
	}

	panelCollapse(panel) {
		this.collapse[panel - 1] = !this.collapse[panel - 1];
	}

	_convertFilesize(filesize) {
		filesize = parseFloat(filesize);

		if (filesize === 0) {
			return "-";
		} else if (filesize < 1073741824) {
			return `${(filesize / 1048576).toFixed(2)} MB`;
		} else {
			return `${(filesize / 1073741824).toFixed(2)} GB`;
		}
	}

	_compareFunction(a, b) {
		if (a.title.toLowerCase() < b.title.toLowerCase()) {
			return -1;
		} else if (a.title.toLowerCase() > b.title.toLowerCase()) {
			return 1;
		}
	}
}
