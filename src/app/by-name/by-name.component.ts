import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { FirebaseService } from "@services/firebase.service";
import { UtilityService } from "@services/utility.service";

@Component({
	selector: "app-byname",
	templateUrl: "./by-name.component.html",
	styleUrls: ["./by-name.component.scss"],
})
export class ByNameComponent implements OnInit {

	data: Array<object> = [];
	dataLoaded: boolean = false;
	collapse: Array<boolean> = [];
	showChart: boolean = true;

	chart = {
		data: [{
			data: [],
			label: "Titles",
			yAxisID: "Titles",
		}, {
			data: [],
			label: "Filesize (GB)",
			yAxisID: "Filesize",
		}],
		colors: [{
			borderColor: "rgba(149, 206, 146, 1)",
			pointBackgroundColor: "rgba(76, 175, 80, 1)",
			pointBorderColor: "rgba(220, 220, 220, 0.3)",
			borderWidth: 2.3,
			fill: false,
			tension: 0.5,
		}, {
			borderColor: "rgba(54, 162, 235, 1)",
			pointBackgroundColor: "rgba(51, 127, 177, 1)",
			pointBorderColor: "rgba(220, 220, 220, 0.3)",
			borderWidth: 2.3,
			fill: false,
			tension: 0.5,
		}],
		labels: [],
		options: {
			responsive: true,
			scales: {
				yAxes: [{
					id: "Titles",
					type: "linear",
					position: "left",
					ticks: {
						beginAtZero: true,
						maxTicksLimit: 5,
						precision: 0,
					},
				}, {
					id: "Filesize",
					type: "linear",
					position: "right",
					ticks: {
						beginAtZero: true,
						maxTicksLimit: 6,
						precision: 0,
					},
				}],
			},
			tooltips: {
				callbacks: {
					label: (tip: any) => (tip.datasetIndex) ? `${tip.yLabel} GB` : `${tip.yLabel} Titles`,
				},
			},
		},
	};

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

		contents.forEach((element, index) => {
			this.collapse.push(false);
			this.pushToChart(rawFilesizes[index], element.length, keys[index]);

			Object.assign(this.data[index], {
				content: contents[index].sort(this.utility.sortByTitle),
				filesize: filesizes[index],
				key: keys[index],
				panel: index,
			});
		});
	}

	private pushToChart(rawFilesize: number, titles: number, key: string) {
		if (!!titles) {
			const filesize = parseFloat(this.utility.convertFilesize(rawFilesize, "0"));
			this.chart.labels.push(key);
			this.chart.data[0].data.push(titles);
			this.chart.data[1].data.push(filesize);
		}
	}

}
