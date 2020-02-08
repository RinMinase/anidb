import { Component, OnInit } from "@angular/core";
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { getMonth, getYear } from "date-fns";
import Swal from "sweetalert2";

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
	offquelSelection = new FormControl("");
	submitted: boolean = false;
	titleList: Array<string> = [];
	options = {
		quality: [
			{ id: "4K 2160p", label: "4K 2160p" },
			{ id: "FHD 1080p", label: "FHD 1080p" },
			{ id: "HD 720p", label: "HD 720p" },
			{ id: "HQ 480p", label: "HQ 480p" },
			{ id: "LQ 360p", label: "LQ 360p" },
		],
		releaseSeason: [
			{ id: "", label: "" },
			{ id: "Winter", label: "Winter" },
			{ id: "Spring", label: "Spring" },
			{ id: "Summer", label: "Summer" },
			{ id: "Fall", label: "Fall" },
		],
		releaseYear: null,
		watchStatus: [
			{ id: 0, label: "Watched" },
			{ id: 1, label: "Downloaded" },
			{ id: 2, label: "Queued" },
		],
	};

	constructor(
		private formBuilder: FormBuilder,
		private modal: NgbActiveModal,
		private firebase: FirebaseService,
		private utility: UtilityService,
		private service: HomeService,
	) {}

	ngOnInit() {
		this.service.currTitleList.subscribe(
			(titleList) => (this.titleList = titleList),
		);

		this.addTitleForm = this.formBuilder.group({
			watchStatus: [""],
			quality: [""],
			title: ["", Validators.required],
			episodes: [""],
			ovas: [""],
			specials: [""],
			dateFinishedRaw: [""],
			filesize: [""],
			inhdd: [true],
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
		this.form.watchStatus.setValue(0);
		this.form.quality.setValue("FHD 1080p");
		this.form.releaseSeason.setValue(this.getCurrentSeason());
		this.form.releaseYear.setValue(this.getCurrentYear());

		this.form.filesize.valueChanges
			.pipe(distinctUntilChanged())
			.subscribe((value) =>
				this.form.filesize.setValue(value.replace(/\D/g, "")),
			);
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
				episodes: parseInt(value.episodes) || 0,
				ovas: parseInt(value.ovas) || 0,
				specials: parseInt(value.specials) || 0,
				dateFinished: null,
				filesize: parseInt(value.filesize) || 0,
				inhdd: value.inhdd ? 1 : 0,
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
				rating: {
					audio: 0,
					enjoyment: 0,
					graphics: 0,
					plot: 0,
				},
			};

			const dateRaw = value.dateFinishedRaw;
			data.dateFinished = dateRaw
				? this.utility.autofillYear(dateRaw)
				: this.utility.getUnix();
			data.duration = value.durationRaw
				? this.service.parseDuration(value.durationRaw)
				: 0;

			this.addEntry(data);
		}
	}

	addOffquel() {
		const { value } = this.offquelSelection;
		const oldValue = this.form.offquel.value;

		this.form.offquel.setValue(!oldValue ? value : `${oldValue}, ${value}`);
		this.offquelSelection.setValue("");
	}

	cancel() {
		Swal.fire({
			title: "Are you sure?",
			text: "This will discard your edits",
			icon: "question",
			showCancelButton: true,
		}).then((result) => {
			if (result.value) {
				this.modal.dismiss();
			}
		});
	}

	titleSearch = (text: Observable<string>) => {
		return text.pipe(debounceTime(200), distinctUntilChanged()).pipe(
			map((term) => {
				if (term.length < 2) {
					return [];
				} else {
					return this.titleList
						.filter(
							(title) => title.toLowerCase().indexOf(term.toLowerCase()) > -1,
						)
						.slice(0, 5);
				}
			}),
		);
	};

	private addEntry(data: any) {
		Swal.fire({
			title: "Are you sure?",
			text: "Please confirm the details of your entry",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, I'm sure",
		}).then((result) => {
			if (result.value) {
				this.firebase.create("anime", data).then(() => {
					Swal.fire({
						title: "Success",
						text: "Your entry has been added",
						icon: "success",
					}).then((successResult) => {
						if (successResult.value) {
							this.modal.close();
						}
					});
				});
			}
		});
	}

	private getCurrentSeason() {
		const month = getMonth(new Date()) + 1;

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
		return getYear(new Date()).toString();
	}
}
