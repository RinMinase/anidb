import { Component, OnInit, OnChanges } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import * as moment from "moment-mini";
import * as Fuse from "fuse.js";

import { FirebaseService } from "src/app/core/services/firebase.service";
import { FuseService } from "src/app/core/builders/fuse.service";

@Component({
	selector: "app-manage-home",
	templateUrl: "./manage-home.component.html",
	styleUrls: ["./manage-home.component.scss"],
})
export class ManageHomeComponent implements OnInit {
	data: Array<Object> = [];
	pristineData: Array<Object> = [];
	titleList: Array<string> = [];
	dataLoaded: Boolean = false;
	fuseOptions = {};
	search = new FormControl("");

	constructor(
		private router: Router,
		private firebase: FirebaseService,
		private fuseOptionsBuilder: FuseService,
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

		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						this.formatData(data);
						this.dataLoaded = true;
						this.onChanges();

						// if (this.$stateParams.id) {
						// 	this.$anchorScroll.yOffset = 55;
						// 	this.$anchorScroll(this.$stateParams.id);
						// }
					});
			}).catch(() => this.router.navigateByUrl("/login"));
	}

	onChanges() {
		this.search.valueChanges
			.pipe(debounceTime(250))
			.subscribe(value => {
				if (value && this.pristineData) {
					this.data = new Fuse(this.pristineData, this.fuseOptions).search(value);
				}
			});
	}

	formatData(data: any) {
		data.map((value: any) => {
			if (value.watchStatus <= 1) {
				const filesize = this._convertFilesize(value.filesize);
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

		this.data = this.data.sort(this._compareFunction);
		this.pristineData = [ ...this.data ];

		if (this.search.value) {
			this.data = new Fuse(this.pristineData, this.fuseOptions).search(this.search.value);
		}
	}

	getData() {
		return (this.search.value) ? this.data : this.pristineData;
	}

	_compareFunction(a: any, b: any) {
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

	_convertFilesize(filesize: any) {
		filesize = parseFloat(filesize);

		if (filesize === 0) {
			return "-";
		} else if (filesize < 1073741824) {
			return `${(filesize / 1048576).toFixed(2)} MB`;
		} else {
			return `${(filesize / 1073741824).toFixed(2)} GB`;
		}
	}
}
