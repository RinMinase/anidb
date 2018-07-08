import moment from "moment";

export class AddHomeController {
	constructor(
		$uibModalInstance,
		firebase,
		titleList
	) {
		"ngInject";

		_.extend(this, {
			$uibModalInstance,
			firebase,
			titleList,

			data: {
				downloadPriority: -1,
				encoder: "",
				firstSeasonTitle: "",
				inHDD: 1,
				offquel: "",
				prequel: "",
				quality: "FHD 1080p",
				rating: {
					audio: 0,
					enjoyment: 0,
					graphics: 0,
					plot: 0,
				},
				releaseSeason: this._getCurrentSeason(),
				releaseYear: moment().year().toString(),
				remarks: "",
				sequel: "",
				variants: "",
				watchStatus: 0,
			},
			options: {
				quality: [
					{id: "4K 2160p", label: "4K 2160p"},
					{id: "FHD 1080p", label: "FHD 1080p"},
					{id: "HD 720p", label: "HD 720p"},
					{id: "HQ 480p", label: "HQ 480p"},
					{id: "LQ 360p", label: "LQ 360p"},
				],
				releaseSeason: [
					{id: "", label: ""},
					{id: "Winter", label: "Winter"},
					{id: "Spring", label: "Spring"},
					{id: "Summer", label: "Summer"},
					{id: "Fall", label: "Fall"},
				],
				releaseYear: this._iterateYears(),
				watchStatus: [
					{id: 0, label: "Watched"},
					{id: 1, label: "Downloaded"},
					{id: 2, label: "Queued"},
				],
			},
			raw: {},
		});

		this.activate();
	}

	activate() {

	}

	add() {
		this.data.episodes = parseInt(this.data.episodes) || 0;
		this.data.filesize = parseInt(this.data.filesize) || 0;
		this.data.ovas = parseInt(this.data.ovas) || 0;
		this.data.specials = parseInt(this.data.specials) || 0;
		this.data.seasonNumber = parseInt(this.data.seasonNumber) || 1;

		if (this.raw.dateFinished) {
			this.data.dateFinished = moment(new Date(this.raw.dateFinished)).unix();
		} else {
			this.data.dateFinished = moment().unix();
		}

		if (this.raw.duration) {
			const duration = this.raw.duration.split(":");

			if (duration.length === 3) {
				const hours = parseInt(duration[0] * 3600);
				const minutes = parseInt(duration[1] * 60);
				const seconds = parseInt(duration[2]);

				this.data.duration = hours + minutes + seconds;
			} else if (duration.length === 2) {
				const minutes = parseInt(duration[0] * 60);
				const seconds = parseInt(duration[1]);

				this.data.duration = minutes + seconds;
			} else {
				const seconds = parseInt(duration[0]);

				this.data.duration = seconds;
			}
		} else {
			this.data.duration = 0;
		}

		this.firebase.create("anime", this.data)
			.then(() => {
				this.$uibModalInstance.close(false);
			});
	}

	addOffquel() {
		if (!this.data.offquel) {
			this.data.offquel = this.offquelSelection;
			this.offquelSelection = "";
		} else {
			this.data.offquel += `, ${this.offquelSelection}`;
			this.offquelSelection = "";
		}
	}

	cancel() {
		this.$uibModalInstance.close(false);
	}

	removeNonNumeric() {
		this.data.filesize = this.data.filesize.replace(/\D/g, "");
	}

	_getCurrentSeason() {
		const month = moment().month() + 1;

		if (month >= 1 && month <= 3) {
			return "Winter";
		} else if (month >= 4 && month <= 6) {
			return "Spring";
		} else if (month >= 7 && month <= 9) {
			return "Summer";
		} else {
			return "Fall";
		}
	}

	_iterateYears() {
		const years = [
			{id: "0", label: ""},
		];
		const limit = 1995;
		const yearToday = moment().year();

		for (let i = yearToday; i >= limit; i--) {
			years.push({
				id: i.toString(),
				label: i.toString(),
			});
		}

		return years;
	}
}
