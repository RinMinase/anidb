import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { debounceTime } from "rxjs/operators";
import * as moment from "moment-mini";
import * as Fuse from "fuse.js";

import { environment } from "@env/environment";
import { FirebaseService } from "@services/firebase.service";
import { FuseOptionsBuilder } from "@builders/fuse-options.service";
import { UtilityService } from "@services/utility.service";
import { HomeService } from "../home.service";
import { AddHomeComponent } from "../add-home/add-home.component";

@Component({
	selector: "app-manage-home",
	templateUrl: "./manage-home.component.html",
	styleUrls: ["./manage-home.component.scss"],
})
export class ManageHomeComponent implements OnInit {

	data: Array<Object> = [];
	pristineData: Array<Object> = [];
	dataLoaded: Boolean = false;

	titleList: Array<string> = [];
	search = new FormControl("");

	fuseOptions = {};
	searchQuery = "";
	homeState = null;

	constructor(
		private router: Router,
		private modalService: NgbModal,
		private firebase: FirebaseService,
		private fuseOptionsBuilder: FuseOptionsBuilder,
		private utility: UtilityService,
		private service: HomeService,
	) {}

	ngOnInit() {
		this.fuseOptions = this.fuseOptionsBuilder
			.threshold(0.3)
			.maxPatternLength(48)
			.minMatchCharLength(0)
			.addKeys("title")
			.addKeys("quality")
			.addKeys("releaseSeason")
			.addKeys("releaseYear")
			.addKeys("encoder")
			.addKeys("variants")
			.addKeys("remarks")
			.build();

		this.service.currentState.subscribe((state) => this.homeState = state);
		this.onChanges();

		if (environment.disableManageHomeQuery) {
			this.dataLoaded = true;
			return;
		}

		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						this.formatData(data);
						this.dataLoaded = true;

						if (this.homeState.id !== null) {
							setTimeout(() => {
								document.getElementById(`${this.homeState.id}`).scrollIntoView();
								window.scrollBy(0, -2046);
							});
						}

						if (this.homeState.search) {
							this.searchQuery = this.homeState.search;
							this.search.patchValue(this.searchQuery);

							if (this.pristineData) {
								this.data = new Fuse(this.pristineData, this.fuseOptions).search(this.searchQuery);
							}
						}
					});
			}).catch(() => this.router.navigateByUrl("/login"));
	}

	addTitle() {
		this.modalService.open(AddHomeComponent, {
			size: "lg",
			windowClass: "animate bounceInDown",
		});
	}

	getData() {
		return (this.search.value) ? this.data : this.pristineData;
	}

	viewTitle(id: number) {
		this.service.changeState(this.searchQuery, id);
		this.router.navigateByUrl(`/view/${id}`);
	}

	private formatData(data: any) {
		data.map((value: any) => {
			if (value.watchStatus <= 1) {
				const filesize = this.utility.convertFilesize(value.filesize);
				let dateFinished: string;

				if (!value.rewatchLast) {
					dateFinished = moment.unix(value.dateFinished).format("MMM DD, YYYY");
				} else {
					dateFinished = moment.unix(value.rewatchLast).format("MMM DD, YYYY");
				}

				this.titleList.push(value.title);
				this.data.push({
					dateFinished,
					encoder: value.encoder,
					episodes: value.episodes,
					filesize,
					id: value.id,
					ovas: value.ovas,
					quality: value.quality,
					releaseSeason: value.releaseSeason,
					releaseYear: value.releaseYear,
					rewatchCount: value.rewatchCount,
					specials: value.specials,
					title: value.title,
				});
			}
		});

		this.data = this.data.sort(this.compareFunction);
		this.pristineData = [ ...this.data ];

		if (this.search.value) {
			this.data = new Fuse(this.pristineData, this.fuseOptions).search(this.search.value);
		}
	}

	private onChanges() {
		this.search.valueChanges
			.pipe(debounceTime(250))
			.subscribe(value => {
				if (value && this.pristineData) {
					this.data = new Fuse(this.pristineData, this.fuseOptions).search(value);
					this.searchQuery = value;
				}
			});
	}

	private compareFunction(a: any, b: any) {
		if (a.quality < b.quality) {
			return -1;
		} else if (a.quality > b.quality) {
			return 1;
		}

		if (a.title < b.title) {
			return -1;
		} else if (a.title > b.title) {
			return 1;
		}
	}
}
