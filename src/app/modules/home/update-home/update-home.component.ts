import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import * as moment from "moment-mini";

import { FirebaseService } from "@services/firebase.service";
import { FirebaseQueryBuilder } from "@builders/firebase-query.service";

@Component({
	selector: "app-update-home",
	templateUrl: "./update-home.component.html",
	styleUrls: ["./update-home.component.scss"],
})
export class UpdateHomeComponent implements OnInit {

	@Input() data: any;

	editTitleForm: FormGroup;
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
		private firebase: FirebaseService,
		private firebaseQueryBuilder: FirebaseQueryBuilder,
	) { }

	ngOnInit() {
		this.editTitleForm = this.formBuilder.group({
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

		this.initFormValues();
	}

	get form() {
		return this.editTitleForm.controls;
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

	private initFormValues() {
		const dateFinishedRaw = moment(new Date(this.data.dateFinished)).format("MMM D YYYY");
		const offquel = (this.data.offquel) ? this.data.offquel.join(",") : "";
		const variants = (this.data.variants) ? this.data.variants.join(",") : "";

		let durationRaw = "";
		if (this.data.duration) {
			const { hours, minutes, seconds } = this.data.duration;
			durationRaw = `${hours}:${minutes}:${seconds}`;
		}

		this.editTitleForm.setValue({
			watchStatus: this.data.watchStatus,
			quality: this.data.quality,
			title: this.data.title,
			episodes: this.data.episodes,
			ovas: this.data.ovas,
			specials: this.data.specials,
			dateFinishedRaw,
			filesize: this.data.filesize,
			inhdd: this.data.inhdd,
			seasonNumber: this.data.seasonNumber,
			firstSeasonTitle: this.data.firstSeasonTitle,
			durationRaw,
			releaseSeason: this.data.releaseSeason,
			releaseYear: this.data.releaseYear,
			encoder: this.data.encoder,
			remarks: this.data.remarks,
			variants,
			prequel: this.data.prequel,
			sequel: this.data.sequel,
			offquel,
		});
	}

}
