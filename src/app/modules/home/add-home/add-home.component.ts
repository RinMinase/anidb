import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import * as moment from "moment-mini";

import { FirebaseService } from "@services/firebase.service";
import { UtilityService } from "@services/utility.service";
import { HomeService } from "../home.service";

@Component({
	selector: "app-add-home",
	templateUrl: "./add-home.component.html",
	styleUrls: ["./add-home.component.scss"],
})
export class AddHomeComponent implements OnInit {

	addTitleForm: FormGroup;
	submitted: boolean = false;
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
		private firebase: FirebaseService,
		private utility: UtilityService,
		private service: HomeService,
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
			inhdd: [""],
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
				inhdd: 1,
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

			const dateRaw = value.dateFinishedRaw;
			data.dateFinished = (dateRaw) ? this.utility.autofillYear(dateRaw) : moment().unix();
			data.duration = (value.durationRaw) ? this.service.parseDuration(value.durationRaw) : 0;

			this.addEntry(data);
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

	private addEntry(data: any) {
		Swal.fire({
			title: "Are you sure?",
			text: "Please confirm the details of your entry",
			type: "question",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, I'm sure",
		}).then((result) => {
			if (result.value) {
				this.firebase.create("anime", data)
					.then(() => {
						Swal.fire({
							title: "Success",
							text: "Your entry has been added",
							type: "success",
						}).then((successResult) => {
							if (successResult.value) { this.modal.close(); }
						});
					});
			}
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

}
