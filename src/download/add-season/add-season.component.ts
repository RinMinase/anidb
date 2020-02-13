import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { faCheck, faTimes } from "@rinminase/ng-fortawesome";
import Swal from "sweetalert2";

@Component({
	selector: "app-add-season",
	templateUrl: "./add-season.component.html",
	styleUrls: ["./add-season.component.scss"],
})
export class AddSeasonComponent implements OnInit {
	faCheck = faCheck;
	faTimes = faTimes;

	constructor(private modal: NgbActiveModal) {}

	ngOnInit() {}

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
}
