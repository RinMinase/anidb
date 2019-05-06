import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { AddSeasonComponent } from "./add-season/add-season.component";
import { AddTitleComponent } from "./add-title/add-title.component";

@Component({
	selector: "app-download",
	templateUrl: "./download.component.html",
	styleUrls: ["./download.component.scss"],
})
export class DownloadComponent implements OnInit {

	constructor(private modalService: NgbModal) { }

	ngOnInit() {
	}

	addSeason() {
		const addModal = this.modalService.open(AddSeasonComponent, {
			centered: true,
			windowClass: "animate bounceInDown",
		});

		addModal.result
			.then(() => {})
			.catch(() => {});
	}

	addTitle() {
		const addModal = this.modalService.open(AddTitleComponent, {
			centered: true,
			windowClass: "animate bounceInDown",
		});

		addModal.result
			.then(() => {})
			.catch(() => {});
	}

}
