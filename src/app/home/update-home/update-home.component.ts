import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { format } from "date-fns";
import Swal from "sweetalert2";

import { FirebaseService } from "@services/firebase.service";
import { FirebaseQueryBuilder } from "@builders/firebase-query.service";
import { UtilityService } from "@services/utility.service";
import { HomeService } from "../home.service";

@Component({
	selector: "app-update-home",
	templateUrl: "./update-home.component.html",
	styleUrls: ["./update-home.component.scss"],
})
export class UpdateHomeComponent implements OnInit {

	@Input() data: any;
	@Input() id: number;

	editTitleForm: FormGroup;
	offquelSelection = new FormControl("");
	submitted: boolean = false;
	titleList: Array<string> = [];
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
		private utility: UtilityService,
		private service: HomeService,
	) { }

	ngOnInit() {
		this.service.currTitleList.subscribe((titleList) => this.titleList = titleList);

		this.editTitleForm = this.formBuilder.group({
			watchStatus: [""],
			quality: [""],
			title: ["", Validators.required],
			episodes: [""],
			ovas: [""],
			specials: [""],
			dateFinishedRaw: [""],
			filesize: [""],
			inhdd: [false],
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

		this.options.releaseYear = this.service.iterateYears();
		this.form.filesize.valueChanges
			.pipe(distinctUntilChanged())
			.subscribe((value) => this.form.filesize.setValue(value.toString().replace(/\D/g, "")));

		this.initFormValues();
	}

	get form() {
		return this.editTitleForm.controls;
	}

	addOffquel() {
		const { value } = this.offquelSelection;
		const oldValue = this.form.offquel.value;

		this.form.offquel.setValue((!oldValue) ? value : `${oldValue}, ${value}`);
		this.offquelSelection.setValue("");
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

	edit() {
		this.submitted = true;

		if (this.editTitleForm.valid) {
			const { value } = this.editTitleForm;
			const data = {
				watchStatus: value.watchStatus,
				quality: value.quality,
				title: value.title,
				episodes: parseInt(value.episodes) || 0,
				ovas: parseInt(value.ovas) || 0,
				specials: parseInt(value.specials) || 0,
				dateFinished: null,
				filesize: parseInt(value.filesize) || 0,
				inhdd: (value.inhdd) ? 1 : 0,
				seasonNumber: parseInt(value.seasonNumber) || 0,
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
				rating: this.parseRating(this.data.rating),
			};

			const dateRaw = value.dateFinishedRaw;
			data.dateFinished = (dateRaw) ? this.utility.autofillYear(dateRaw) : this.utility.getUnix();
			data.duration = (value.durationRaw) ? this.service.parseDuration(value.durationRaw) : 0;

			// this.updateEntry(data);
		}
	}

	titleSearch = (text: Observable<string>) => {
		return text
			.pipe(debounceTime(200), distinctUntilChanged())
			.pipe(
				map((term) => {
					if (term.length < 2) {
						return [];
					} else {
						return this.titleList
							.filter((title) => title.toLowerCase().indexOf(term.toLowerCase()) > -1)
							.slice(0, 5);
					}
				}),
			);
	}

	private initFormValues() {
		const dateFinishedRaw = format(new Date(this.data.dateFinished), "MMM D YYYY");
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
			filesize: this.data.filesizeRaw,
			inhdd: !!this.data.inhdd,
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

	private parseRating(rating: any) {
		if (rating) {
			return {
				audio: rating.audio || 0,
				enjoyment: rating.enjoyment || 0,
				graphics: rating.graphics || 0,
				plot: rating.plot || 0,
			};
		} else {
			return { audio: 0, enjoyment: 0, graphics: 0, plot: 0 };
		}
	}

	private updateEntry(data: any) {
		Swal.fire({
			title: "Are you sure?",
			text: "Please confirm the details of your entry",
			type: "question",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, I'm sure",
		}).then((result) => {
			if (result.value) {
				this.firebase.update(this.firebaseQueryBuilder.init().id(this.id).data(data).build())
					.then(() => {
						Swal.fire({
							title: "Success",
							text: "Your edits has been saved",
							type: "success",
						}).then((successResult) => {
							if (successResult.value) { this.modal.close(); }
						});
					});
			}
		});
	}

}
