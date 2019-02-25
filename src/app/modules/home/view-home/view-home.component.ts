import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment-mini";

import { FirebaseService } from "@services/firebase.service";
import { FirebaseQueryBuilder } from "@builders/firebase-query.service";
import { UtilityService } from "@services/utility.service";
import { UpdateHomeComponent } from "../update-home/update-home.component";

@Component({
	selector: "app-view-home",
	templateUrl: "./view-home.component.html",
	styleUrls: ["./view-home.component.scss"],
})
export class ViewHomeComponent implements OnInit {

	data: Array<Object> = [];
	dataLoaded: Boolean = false;
	stateId: number;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private modalService: NgbModal,
		private firebase: FirebaseService,
		private firebaseQueryBuilder: FirebaseQueryBuilder,
		private utility: UtilityService,
	) { }

	ngOnInit() {
		this.route.params.subscribe((params) => this.stateId = params["id"]);

		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve(this.firebaseQueryBuilder.id(this.stateId).build())
					.then((data: any) => {
						if (data.variants) {
							data.shortTitle = data.variants.split(",")
								.sort((a: any, b: any) => a.length - b.length)[0];
						}

						if (data.variants) { data.variants = data.variants.split(","); }
						if (data.offquel) { data.offquel = data.offquel.split(","); }

						// this.filesizeForUpdateModal = data.filesize;
						data.filesize = this.utility.convertFilesize(data.filesize);
						data.dateFinished = moment.unix(data.dateFinished)
							.format("MMMM DD, YYYY");

						if (data.duration) {
							const { duration } = data;
							const hours = (duration / 3600).toFixed(0).padStart(2, "0");
							const minutes = ((duration % 3600) / 60).toFixed(0).padStart(2, "0");
							const seconds = ((duration % 3600) % 60).toFixed(0).padStart(2, "0");

							data.duration = { hours, minutes, seconds };
						}

						if (data.rewatch) {
							data.rewatchCount = data.rewatch.split(",").length;
							data.lastRewatch = moment.unix(data.rewatchLast).format("MMMM DD, YYYY");
						} else {
							data.rewatchCount = 0;
						}

						this.data = data;
						this.dataLoaded = true;
					}).catch(() => this.router.navigateByUrl("/home"));
			}).catch(() => this.router.navigateByUrl("/login"));
	}

	editTitle() {
		this.modalService.open(UpdateHomeComponent, {
			size: "lg",
			windowClass: "animate bounceInDown",
		});
	}
}
