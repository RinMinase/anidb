import extend from "lodash/extend";
import moment from "moment-mini";

export class UpdateHomeController {
	constructor (
		$uibModalInstance,
		$state,
		firebase,
		SweetAlert,
		data,
		filesize,
		id,
		years
	) {
		"ngInject";

		extend(this, {
			$uibModalInstance,
			$state,
			firebase,
			SweetAlert,

			data,
			id,
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
				releaseYear: years,
				watchStatus: [
					{id: 0, label: "Watched"},
					{id: 1, label: "Downloaded"},
					{id: 2, label: "Queued"},
				],
			},
			raw: {},
			titleList: [],
		});

		extend(this.data, {
			filesize,
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve("anime", "", 0, "", false, false)
					.then((data) => {
						data.map((value) => {
							this.titleList.push(value.title);
						});
					});
			});

		this.raw.dateFinished = moment(new Date(this.data.dateFinished))
			.format("MMM D YYYY");
		this.data.dateFinished = "";

		if (this.data.duration) {
			const { hours, minutes, seconds } = this.data.duration;

			this.raw.duration = `${hours}:${minutes}:${seconds}`;
			this.data.duration = "";
		}


		if (this.data.offquel) {
			this.data.offquel = this.data.offquel.join(",");
		}

		if (this.data.variants) {
			this.data.variants = this.data.variants.join(",");
		}
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

	update() {
		this.data.episodes = parseInt(this.data.episodes) || 0;
		this.data.filesize = parseInt(this.data.filesize) || 0;
		this.data.ovas = parseInt(this.data.ovas) || 0;
		this.data.specials = parseInt(this.data.specials) || 0;
		this.data.seasonNumber = parseInt(this.data.seasonNumber) || 0;

		if (this.raw.dateFinished) {
			this.data.dateFinished = this._autofillYear(this.raw.dateFinished);
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

		this.SweetAlert.swal({
			title: "Are you sure?",
			text: "Please confirm the details of your entry.",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, I'm sure",
			closeOnConfirm: false,
		}, (isConfirm) => {
			if (isConfirm) {
				this.firebase.update("anime", this.id, this.data)
					.then(() => {
						this.SweetAlert.swal({
							title: "Success",
							text: "Your entry has been updated",
							type: "success",
						}, () => {
							this.$uibModalInstance.close(false);
							this.$state.reload();
						});
					});
			}
		});
	}

	_autofillYear(date) {
		if (date.split(" ").length === 2) {
			const monthRaw = parseInt(date.split(" ")[0]) || date.split(" ")[0];
			const day = parseInt(date.split(" ")[1]) || date.split(" ")[1];
			let month;

			if (isNaN(monthRaw)) {
				month = parseInt(moment(monthRaw, "MMM").format("MM"));
			} else {
				month = parseInt(moment(monthRaw, "MM").format("MM"));
			}

			const yearToday = moment().year();
			const dateParsed = `${month} ${day} ${yearToday}`;
			const dateParsedUnix = moment(dateParsed, "MM D YYYY").unix();
			const dateTodaytUnix = moment().unix();

			if (dateParsedUnix > dateTodaytUnix) {
				date += ` ${(moment().year() - 1).toString()}`;
			} else {
				date += ` ${(moment().year()).toString()}`;
			}
		}

		if ((new Date(date)).toString().indexOf("Invalid Date") === 0) {
			return moment().unix();
		} else {
			return moment(new Date(date)).unix();
		}
	}
}
