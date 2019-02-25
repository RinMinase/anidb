import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import * as moment from "moment-mini";

@Component({
	selector: "app-add-home",
	templateUrl: "./add-home.component.html",
	styleUrls: ["./add-home.component.scss"],
})
export class AddHomeComponent implements OnInit {

	addTitleForm: FormGroup;
	submitted: Boolean = false;
	options = {
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
		releaseYear: null,
		watchStatus: [
			{id: 0, label: "Watched"},
			{id: 1, label: "Downloaded"},
			{id: 2, label: "Queued"},
		],
	};

	constructor(
		private formBuilder: FormBuilder,
		private modal: NgbActiveModal,
	) { }

	ngOnInit() {
		this.addTitleForm = this.formBuilder.group({
			watchStatus: [""],
			quality: [""],
			title: ["", Validators.required],
			episodes: [""],
			ovas: [""],
			specials: [""],
			dateFinishedRaw: [""],
			filesize: [""],
			hdd: [""],
			seasonNumber: [""],
			firstSeasonTitle: [""],
			durationRaw: [""],
			releaseSeason: [""],
			releaseYear: [""],
			encoder: [""],
			remarks: [""],
			variants: [""],
			prequel: [""],
			sequel: [""],
			offquel: [""],
		});

		this.options.releaseYear = this.iterateYears();
		this.addTitleForm.controls.watchStatus.setValue(0);
		this.addTitleForm.controls.quality.setValue("FHD 1080p");
		this.addTitleForm.controls.releaseSeason.setValue(this.getCurrentSeason());
		this.addTitleForm.controls.releaseYear.setValue(this.getCurrentYear());
	}

	get form() {
		return this.addTitleForm.controls;
	}

	add() {
		this.submitted = true;
		if (this.addTitleForm.valid) {
			Swal.fire({
				title: "Are you sure?",
				text: "This will save your edits",
				type: "question",
				showCancelButton: true,
			}).then((result) => {
				if (result.value) {
					const { value } = this.addTitleForm;
					const data = {
						watchStatus: value.watchStatus,
						quality: value.quality,
						title: value.title,
						episodes: parseInt(value.episodes, 10) || 0,
						ovas: parseInt(value.ovas, 10) || 0,
						specials: parseInt(value.specials, 10) || 0,
						dateFinished: null,
						filesize: parseInt(value.filesize, 10) || 0,
						hdd: 1,
						seasonNumber: parseInt(value.seasonNumber, 10) || 0,
						firstSeasonTitle: value.firstSeasonTitle,
						duration: null,
						releaseSeason: value.releaseSeason,
						releaseYear: value.releaseYear,
						encoder: value.encoder,
						remarks: value.remarks,
						variants: value.variants,
						prequel: value.prequel,
						sequel: value.sequel,
						offquel: value.offquel,
					};

					if (value.dateFinishedRaw) {
						data.dateFinished = this.parseDateFinished(value.dateFinishedRaw);
					} else {
						data.dateFinished = moment().unix();
					}

					if (value.durationRaw) {
						data.duration = this.parseDuration(value.durationRaw);
					} else {
						data.duration = 0;
					}
				}
			});
		}
	}

	cancel() {
		Swal.fire({
			title: "Are you sure?",
			text: "This will discard your edits",
			type: "question",
			showCancelButton: true,
		}).then((result) => {
			if (result.value) { this.modal.dismiss(); }
		});
	}

	private getCurrentSeason() {
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

	private getCurrentYear() {
		return moment().year().toString();
	}

	private iterateYears(): Array<any> {
		const years = [{ id: "0", label: "" }];
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

	private parseDateFinished(date: string) {
		if (date.split(" ").length === 2) {
			const monthRaw: any = parseInt(date.split(" ")[0], 10) || date.split(" ")[0];
			const day = parseInt(date.split(" ")[1], 10) || date.split(" ")[1];
			let month: any;

			if (isNaN(monthRaw)) {
				month = parseInt(moment(monthRaw, "MMM").format("MM"), 10);
			} else {
				month = parseInt(moment(monthRaw, "MM").format("MM"), 10);
			}

			const yearToday = moment().year();
			const dateParsed = `${month} ${day} ${yearToday}`;
			const dateParsedUnix = moment(dateParsed, "MM D YYYY").unix();
			const dateTodayUnix = moment().unix();

			if (dateParsedUnix > dateTodayUnix) {
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

	private parseDuration(duration: string) {
		const durationParts = duration.split(":");

		if (durationParts.length === 3) {
			const hours = (parseInt(durationParts[0], 10) * 3600);
			const minutes = (parseInt(durationParts[1], 10) * 60);
			const seconds = parseInt(durationParts[2], 10);
			return hours + minutes + seconds;
		} else if (durationParts.length === 2) {
			const minutes = (parseInt(durationParts[0], 10) * 60);
			const seconds = parseInt(durationParts[1], 10);
			return minutes + seconds;
		} else {
			const seconds = parseInt(durationParts[0], 10);
			return seconds;
		}
	}

}
