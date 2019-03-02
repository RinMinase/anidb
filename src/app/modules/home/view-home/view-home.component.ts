import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { format } from "date-fns";

import { FirebaseService } from "@services/firebase.service";
import { FirebaseQueryBuilder } from "@builders/firebase-query.service";
import { UtilityService } from "@services/utility.service";
import { UpdateHomeComponent } from "../update-home/update-home.component";
import { RewatchComponent } from "./rewatch/rewatch.component";
import { HomeService } from "../home.service";

@Component({
	selector: "app-view-home",
	templateUrl: "./view-home.component.html",
	styleUrls: ["./view-home.component.scss"],
})
export class ViewHomeComponent implements OnInit {

	data: any;
	dataLoaded: boolean = false;
	stateId: number;
	homeState: any;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private modalService: NgbModal,
		private firebase: FirebaseService,
		private firebaseQueryBuilder: FirebaseQueryBuilder,
		private utility: UtilityService,
		private service: HomeService,
	) { }

	ngOnInit() {
		this.route.params.subscribe((params) => this.stateId = params["id"]);
		this.service.currentState.subscribe((state) => this.homeState = state);
		this.fetchData();
	}

	editTitle() {
		const updateModal = this.modalService.open(UpdateHomeComponent, {
			size: "lg",
			windowClass: "animate bounceInDown",
		});

		updateModal.componentInstance.data = this.data;
		updateModal.componentInstance.id = this.stateId;

		updateModal.result
			.then(() => { this.fetchData(); })
			.catch(() => {});
	}

	viewRewatch() {
		const rewatchModal = this.modalService.open(RewatchComponent, {
			windowClass: "animate bounceInDown",
			centered: true,
		});

		const rewatch = (this.data.rewatch) ? this.data.rewatch.split(",") : [];

		rewatchModal.componentInstance.id = this.stateId;
		rewatchModal.componentInstance.rewatch = rewatch;

		rewatchModal.result
			.then(() => { this.fetchData(); })
			.catch(() => {});
	}

	deleteTitle() {
		Swal.fire({
			title: "Are you sure?",
			text: "Your will not be able to recover this entry!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
		}).then((result) => {
			if (result.value) {
				this.service.changeState(this.homeState.search, null);
				this.firebase.hardDelete(this.firebaseQueryBuilder.id(this.stateId).build())
					.then(() => {
						Swal.fire("Deleted", "Entry has been deleted", "success")
							.then(() => this.router.navigateByUrl("/"));
					});
			}
		});
	}

	private fetchData() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve(this.firebaseQueryBuilder.id(this.stateId).build())
					.then((data: any) => {
						this.data = this.parseData(data);
						this.dataLoaded = true;
					}).catch(() => this.router.navigateByUrl("/"));
			}).catch(() => this.router.navigateByUrl("/login"));
	}

	private parseData(data: any) {
		if (data.variants) {
			data.shortTitle = this.parseVariants(data.variants);
		}

		if (data.variants) { data.variants = data.variants.split(","); }
		if (data.offquel) { data.offquel = data.offquel.split(","); }

		data.filesize = this.utility.convertFilesize(data.filesize);
		data.dateFinished = format(data.dateFinished * 1000, "MMMM DD, YYYY");

		if (data.duration) {
			data.duration = this.parseDuration(data.duration);
		}

		if (data.rewatch) {
			data.rewatchCount = data.rewatch.split(",").length;
			data.lastRewatch = format(data.rewatchLast * 1000, "MMMM DD, YYYY");
		} else {
			data.rewatchCount = 0;
		}

		return data;
	}

	private parseDuration(duration: number) {
		const hours = (duration / 3600).toFixed(0).padStart(2, "0");
		const minutes = ((duration % 3600) / 60).toFixed(0).padStart(2, "0");
		const seconds = ((duration % 3600) % 60).toFixed(0).padStart(2, "0");

		return { hours, minutes, seconds };
	}

	private parseVariants(variants: string) {
		return variants.split(",").sort((a: any, b: any) => a.length - b.length)[0];
	}
}
