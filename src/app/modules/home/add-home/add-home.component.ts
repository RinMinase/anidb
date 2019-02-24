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
			watchStatus: ["", Validators.required],
			quality: ["", Validators.required],
			title: ["", Validators.required],
			episodes: ["", Validators.required],
			ovas: ["", Validators.required],
			specials: ["", Validators.required],
			dateFinishedRaw: ["", Validators.required],
			filesize: ["", Validators.required],
			hdd: ["", Validators.required],
			seasonNumber: ["", Validators.required],
			firstSeasonTitle: ["", Validators.required],
			durationRaw: ["", Validators.required],
			releaseSeason: ["", Validators.required],
			releaseYear: ["", Validators.required],
			encoder: ["", Validators.required],
			remarks: ["", Validators.required],
			variants: ["", Validators.required],
			prequel: ["", Validators.required],
			sequel: ["", Validators.required],
			offquel: ["", Validators.required],
		});

		this.options.releaseYear = this.iterateYears();
		this.addTitleForm.controls.watchStatus.setValue(0);
		this.addTitleForm.controls.quality.setValue("FHD 1080p");
		this.addTitleForm.controls.releaseSeason.setValue(this.getCurrentSeason());
		this.addTitleForm.controls.releaseYear.setValue(this.getCurrentYear());
	}

	add() {
		Swal.fire({
			title: "Are you sure?",
			text: "This will save your edits",
			type: "question",
			showCancelButton: true,
		}).then((result) => {
			if (result.value) {
				// success
			}
		});
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

	private autofillYear(date: string) {
		if (date.split(" ").length === 2) {
			const monthRaw = parseInt(date.split(" ")[0], 10) || date.split(" ")[0];
			const day = parseInt(date.split(" ")[1], 10) || date.split(" ")[1];
			// let month;
			const month = "January";

			// if (isNaN(monthRaw)) {
			// 	month = parseInt(moment(monthRaw, "MMM").format("MM"), 10);
			// } else {
			// 	month = parseInt(moment(monthRaw, "MM").format("MM"), 10);
			// }

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

}
