import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { format, fromUnixTime } from "date-fns";

import { FirebaseService } from "@services/firebase.service";
import { FirebaseQueryBuilder } from "@builders/firebase-query.service";
import { UtilityService } from "@services/utility.service";

@Component({
	selector: "app-rewatch",
	templateUrl: "./rewatch.component.html",
})
export class RewatchComponent implements OnInit {

	@Input() id: number;
	@Input() rewatch: Array<any>;

	rewatchForm: FormGroup;
	submitted: boolean = false;
	dataRewatch: Array<any> = [];

	constructor(
		private formBuilder: FormBuilder,
		private modal: NgbActiveModal,
		private firebase: FirebaseService,
		private firebaseQueryBuilder: FirebaseQueryBuilder,
		private utility: UtilityService,
	) { }

	ngOnInit() {
		this.rewatchForm = this.formBuilder.group({
			date: ["", Validators.required],
		});

		this.formatRewatch();
	}

	get form() {
		return this.rewatchForm.controls;
	}

	add() {
		this.submitted = true;

		if (this.rewatchForm.valid) {
			const date = this.utility.autofillYear(this.form.date.value);

			if (!this.rewatch.includes(date)) {
				this.rewatch.push(date);
				this.rewatch.sort((a, b) => b - a);

				const data = {
					rewatch: this.rewatch.toString(),
					rewatchLast: this.rewatch[0],
				};

				this.firebase.update(this.firebaseQueryBuilder.init().id(this.id).data(data).build());
				this.initializeForm();
				this.formatRewatch();
			}
		}
	}

	cancel() {
		this.modal.close();
	}

	delete(index: number) {
		this.rewatch.splice(index, 1);
		const data = {
			rewatch: this.rewatch.toString(),
			rewatchLast: this.rewatch[0] || "",
		};

		this.firebase.update(this.firebaseQueryBuilder.init().id(this.id).data(data).build());
		this.formatRewatch();
	}

	private initializeForm() {
		this.form.date.setValue("");
		this.submitted = false;
	}

	private formatRewatch() {
		this.dataRewatch = [];
		if (this.rewatch.length > 0) {
			this.rewatch.forEach((value, index) => {
				this.dataRewatch[index] = format(fromUnixTime(value), "MMM dd, yyyy");
			});
		}
	}

}
