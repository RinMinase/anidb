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
	) {}

	ngOnInit() {
		let hddData: Array<object>;
		let animeData: Array<object>;

		this.firebase
			.auth()
			.then(() => {
				this.firebase.retrieve().then((data: Array<object>) => {
					animeData = data;
				});
			})
			.then(() => {
				this.firebase
					.retrieve(
						this.firebaseQueryBuilder
							.init()
							.db("hdd")
							.inhdd(false)
							.build(),
					)
					.then((data: Array<object>) => {
						hddData = data;
						this.formatData(hddData, animeData);
						this.dataLoaded = true;
					});
			})
			.catch(() => this.router.navigateByUrl("/login"));
	}

	formatData(hddData: Array<any>, animeData: Array<any>) {
		let finalSize = 0;
		let finalUsed = 0;
		let finalHddSize = 0;

		this.data.push({ hdd: { from: "TOTAL" } });

		hddData.forEach((hdd, index) => {
			const sizeRaw = hdd.size / 1073741824;
			let size: string;
			let totalSize = 0;

			if (sizeRaw >= 1024) {
				size = `${(hdd.size / 1099511627776).toFixed(2)} TB`;
			} else {
				size = `${sizeRaw.toFixed(2)} GB`;
			}

			this.data.push({
				hdd: {
					from: hdd.from.toUpperCase(),
					to: hdd.to.toUpperCase(),
					total: size,
				},
				entries: [],
			});

			animeData.forEach((anime) => {
				const firstLetter = anime.title.toUpperCase().charCodeAt();
				const from = hdd.from.toUpperCase().charCodeAt();
				const to = hdd.to.toUpperCase().charCodeAt();

				const charCode0 = 48;
				const charCode9 = 57;
				const isTitleNumeric: boolean =
					firstLetter >= charCode0 &&
					firstLetter <= charCode9 &&
					String.fromCharCode(from) === "A";

				if (isTitleNumeric || (firstLetter >= from && firstLetter <= to)) {
					this.data[index + 1].entries.push({
						filesize: this.utility.convertFilesize(anime.filesize),
						quality: anime.quality,
						title: anime.title,
					});
					totalSize += anime.filesize;
				}

				if (index === 0) {
					finalSize += anime.filesize;
				}
			});

			this.data.forEach(
				({ entries }) => entries && entries.sort(this.utility.sortByTitle),
			);

			finalHddSize += hdd.size;
			finalUsed += totalSize;

			this.formatSingle(totalSize, hdd.size, index);
		});

		this.formatTotal(finalSize, finalUsed, finalHddSize, animeData.length);
	}

	formatSingle(totalSize: number, hddSize: number, index: number) {
		const titles = this.data[index + 1].entries.length;
		const percent = parseInt(((totalSize / hddSize) * 100).toFixed(0));
		const freeRaw = (hddSize - totalSize) / 1073741824;
		const usedRaw = totalSize / 1073741824;
		let free: string;
		let used: string;
		let percentType: string;

		if (freeRaw >= 1024) {
			free = `${((hddSize - totalSize) / 1099511627776).toFixed(2)} TB`;
		} else {
			free = `${freeRaw.toFixed(2)} GB`;
		}

		if (usedRaw >= 1024) {
			used = `${(totalSize / 1099511627776).toFixed(2)} TB`;
		} else {
			used = `${usedRaw.toFixed(2)} GB`;
		}

		if (percent >= 0 && percent < 80) {
			percentType = "success";
		} else if (percent >= 80 && percent < 90) {
			percentType = "warning";
		} else {
			percentType = "danger";
		}

		this.collapse.push(false);

		Object.assign(this.data[index + 1].hdd, {
			free,
			panel: this.collapse.length,
			percent,
			percentType,
			titles,
			used,
		});
	}

	formatTotal(
		finalSize: number,
		finalUsed: number,
		finalHddSize: number,
		finalTitles: number,
	) {
		const finalFree = ((finalHddSize - finalUsed) / 1073741824).toFixed(2);
		const finalFreeTB = ((finalHddSize - finalUsed) / 1099511627776).toFixed(2);
		const finalUsedFmt = (finalUsed / 1099511627776).toFixed(2);
		const finalHddSizeFmt = (finalHddSize / 1099511627776).toFixed(2);
		const finalPercent = parseInt(
			((finalSize / finalHddSize) * 100).toFixed(0),
		);
		let finalPercentType: string;

		if (finalPercent >= 0 && finalPercent < 80) {
			finalPercentType = "success";
		} else if (finalPercent >= 80 && finalPercent < 90) {
			finalPercentType = "warning";
		} else {
			finalPercentType = "danger";
		}

		Object.assign(this.data[0].hdd, {
			free: `${finalFree} GB (${finalFreeTB} TB)`,
			total: `${finalHddSizeFmt} TB`,
			percent: finalPercent,
			percentType: finalPercentType,
			titles: finalTitles,
			used: `${finalUsedFmt} TB`,
		});
	}

	panelCollapse(panel: number) {
		this.collapse[panel - 1] = !this.collapse[panel - 1];
	}
}
