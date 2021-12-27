import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { fasPlus } from "@rinminase/ng-fortawesome";

@Component({
	selector: 'app-hdd-sim',
	templateUrl: './hdd-sim.component.html',
	styleUrls: ['./hdd-sim.component.scss']
})
export class HddSimComponent implements OnInit {

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

	fasPlus = fasPlus;
	addDriveForm: FormGroup;
	letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

	constructor(
		private formBuilder: FormBuilder,
	) { }

	ngOnInit() {
		this.addDriveForm = this.formBuilder.group({
			to: ["", Validators.required],
			from: ["", Validators.required],
			size: ["", Validators.required],
		});
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
}
