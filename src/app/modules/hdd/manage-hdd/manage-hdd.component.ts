import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { FirebaseService } from "@services/firebase.service";
import { FirebaseQueryBuilder } from "@builders/firebase-query.service";
import { UtilityService } from "@services/utility.service";

@Component({
	selector: "app-manage-hdd",
	templateUrl: "./manage-hdd.component.html",
})
export class ManageHddComponent implements OnInit {

	data: Array<any> = [];
	dataLoaded: boolean = false;
	collapse: Array<boolean> = [];

	constructor(
		private router: Router,
		private firebase: FirebaseService,
		private firebaseQueryBuilder: FirebaseQueryBuilder,
		private utility: UtilityService,
	) { }

	ngOnInit() {
		let hddData: Array<Object>;
		let animeData: Array<Object>;

		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data: Array<Object>) => {
						animeData = data;
					});
			}).then(() => {
				this.firebase.retrieve(this.firebaseQueryBuilder.db("hdd").inhdd(false).build())
					.then((data: Array<Object>) => {
						hddData = data;
						this.formatData(hddData, animeData);
						this.dataLoaded = true;
					});
			}).catch(() => this.router.navigateByUrl("/login"));
	}

	formatData(hddData: Array<any>, animeData: Array<any>) {
		hddData.forEach((hdd, index) => {
			const size = (hdd.size / 1073741824).toFixed(2);
			let totalSize = 0;

			this.data.push({
				hdd: {
					from: hdd.from.toUpperCase(),
					to: hdd.to.toUpperCase(),
					total: `${size} GB`,
				},
				entries: [],
			});

			animeData.forEach((anime) => {
				const firstLetter = anime.title.toUpperCase().charCodeAt();
				const from = hdd.from.toUpperCase().charCodeAt();
				const to = hdd.to.toUpperCase().charCodeAt();

				const charCode0 = 48;
				const charCode9 = 57;
				const isTitleNumeric: boolean = firstLetter >= charCode0
					&& firstLetter <= charCode9
					&& String.fromCharCode(from) === "A";

				if (isTitleNumeric || (firstLetter >= from && firstLetter <= to)) {
					this.data[index].entries.push({
						filesize: this.utility.convertFilesize(anime.filesize),
						quality: anime.quality,
						title: anime.title,
					});
					totalSize += anime.filesize;
				}
			});

			this.data.forEach((data) => data.entries.sort(this.utility.sortByTitle));

			const free = ((hdd.size - totalSize) / 1073741824).toFixed(2);
			const used = (totalSize / 1073741824).toFixed(2);
			const titles = this.data[index].entries.length;
			const percent = parseInt(((totalSize / hdd.size) * 100).toFixed(0), 10);
			let percentType: string;

			if (percent >= 0 && percent < 80) {
				percentType = "success";
			} else if (percent >= 80 && percent < 90) {
				percentType = "warning";
			} else {
				percentType = "danger";
			}

			this.collapse.push(false);

			Object.assign(this.data[index].hdd, {
				free: `${free} GB`,
				panel: this.collapse.length,
				percent,
				percentType,
				titles,
				used: `${used} GB`,
			});
		});
	}

	panelCollapse(panel: number) {
		this.collapse[panel - 1] = !this.collapse[panel - 1];
	}

}
