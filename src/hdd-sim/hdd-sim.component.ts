import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { fasGripLinesVertical, fasPlus, fasTrashAlt } from "@rinminase/ng-fortawesome";

// import { FirebaseQueryBuilder } from '@builders/firebase-query.service';
// import { FirebaseService } from '@services/firebase.service';

@Component({
	selector: 'app-hdd-sim',
	templateUrl: './hdd-sim.component.html',
	styleUrls: ['./hdd-sim.component.scss']
})
export class HddSimComponent implements OnInit {

	fasPlus = fasPlus;
	fasTrashAlt = fasTrashAlt;
	fasGripLinesVertical = fasGripLinesVertical;

	addDriveForm: FormGroup;

	letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
	TB = 1000169533440;

	submitted = false;
	dataLoaded = true;

	data = [
		{
			from: "A",
			to: "C",
			size: 2 * this.TB,
		},
		{
			from: "D",
			to: "Z",
			size: 1 * this.TB,
		},
	];

	configs = [
		{
			id: 0,
			name: "Config 1",
			config: [
				{
					from: "A",
					to: "P",
					size: 2 * this.TB,
				},
				{
					from: "Q",
					to: "Z",
					size: 1 * this.TB,
				},
			]
		},
		{
			id: 1,
			name: "Config 2",
			config: [
				{
					from: "A",
					to: "D",
					size: 2 * this.TB,
				},
				{
					from: "E",
					to: "Z",
					size: 2 * this.TB,
				},
			]
		},
	];


	constructor(
		private formBuilder: FormBuilder,
		// private firebase: FirebaseService,
		// private firebaseQueryBuilder: FirebaseQueryBuilder,
	) { }

	ngOnInit() {
		this.addDriveForm = this.formBuilder.group({
			to: ["", Validators.required],
			from: ["", Validators.required],
			size: ["", Validators.required],
		});


		// this.firebase
		// 	.auth()
		// 	.then(() => {
		// 		this.firebase.retrieve(
		// 			this.firebaseQueryBuilder
		// 				.init()
		// 				.db("config")
		// 				.inhdd(false)
		// 				.build(),
		// 		).then(() => {})

		// 		this.firebase.retrieve()
		// 			.then((data: Array<object>) => {
		// 				this.formatData(data);
		// 				this.dataLoaded = true;
		// 			});
		// 	});
	}

	get form() {
		return this.addDriveForm.controls;
	}

	addDrive() {
		this.submitted = true;

		if (this.addDriveForm.valid) {
			const { value } = this.addDriveForm;

			if (value.size > 10 || value.size < 0.5) {
				console.log('sulod')
				this.addDriveForm.controls.size.setErrors({
					incorrect: "Invalid drive size"
				});
			} else {
				// valid form
			}
		}
	}

	setConfig(id: number) {
		this.data = this.configs[id].config;
	}

	deleteConfig(_id: number) {
		// delete config
	}

	formatData(_data: Array<object>) {
		// handle data
	}
}
