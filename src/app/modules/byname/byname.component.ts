import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { FirebaseService } from "@services/firebase.service";
import { UtilityService } from "@services/utility.service";

@Component({
	selector: "app-byname",
	templateUrl: "./byname.component.html",
})
export class BynameComponent implements OnInit {

	data: Array<object> = [];
	dataLoaded: boolean = false;
	collapse: Array<boolean> = [];

	constructor(
		private router: Router,
		private firebase: FirebaseService,
		private utility: UtilityService,
	) { }

	ngOnInit() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						this.formatData(data);
						this.dataLoaded = true;
					});
			}).catch(() => this.router.navigateByUrl("/login"));
	}

	panelCollapse(panel: number) {
		this.collapse[panel - 1] = !this.collapse[panel - 1];
	}

	private formatData(rawData: any) {
		const rawFilesizes = new Array(27);
		const contents = new Array(27);
		const filesizes = new Array(27);
		const keys = new Array(27);

		for (let i = 0; i < contents.length; i++) {
			this.data[i] = {};
			contents[i] = [];
			filesizes[i] = "";
			rawFilesizes[i] = 0;

			if (i === 0) {
				keys[i] = "#";
			} else {
				keys[i] = String.fromCharCode(i + 64);
			}
		}

		rawData.map((data: any) => {
			if (data.inhdd === 1) {
				const currCharCode = data.title[0].toLowerCase().charCodeAt();

				if (currCharCode >= 48 && currCharCode <= 57) {
					rawFilesizes[0] += data.filesize;

					data.filesize = this.utility.convertFilesize(data.filesize);
					contents[0].push(data);
				} else if (currCharCode >= 97 && currCharCode <= 122) {
					rawFilesizes[currCharCode - 96] += data.filesize;

					data.filesize = this.utility.convertFilesize(data.filesize);
					contents[currCharCode - 96].push(data);
				}
			}
		});

		rawFilesizes.forEach((element, index) => {
			filesizes[index] = this.utility.convertFilesize(element, "-");
		});

		contents.forEach((_element, index) => {
			this.collapse.push(false);

			Object.assign(this.data[index], {
				content: contents[index].sort(this.utility.sortByTitle),
				filesize: filesizes[index],
				key: keys[index],
				panel: index,
			});
		});
	}

}
