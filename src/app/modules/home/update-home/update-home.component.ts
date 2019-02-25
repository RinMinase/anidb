import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

@Component({
	selector: "app-update-home",
	templateUrl: "./update-home.component.html",
	styleUrls: ["./update-home.component.scss"],
})
export class UpdateHomeComponent implements OnInit {

	constructor(private modal: NgbActiveModal) { }

	ngOnInit() {
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

}
