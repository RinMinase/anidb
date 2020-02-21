import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
	fasAngleDown,
	fasPencilAlt,
	fasSearch,
	fasTrash,
} from "@rinminase/ng-fortawesome";

import { FirebaseService } from "@services/firebase.service";
import { FirebaseQueryBuilder } from "@builders/firebase-query.service";

@Component({
	selector: "app-byyear",
	templateUrl: "./by-year.component.html",
	styleUrls: ["./by-year.component.scss"],
})
export class ByYearComponent implements OnInit {
	fasAngleDown = fasAngleDown;
	fasPencil = fasPencilAlt;
	fasSearch = fasSearch;
	fasTrash = fasTrash;

	objKeys = Object.keys;
	data = {};
	dataLoaded: boolean = false;
	category = { year: 0, season: 0 };
	keys = {};
	collapse = {
		0: false,
		2: false,
		3: false,
	};

	constructor(
		private router: Router,
		private firebase: FirebaseService,
		private firebaseQueryBuilder: FirebaseQueryBuilder,
	) {}

	ngOnInit() {
		this.firebase
			.auth()
			.then(() => {
				this.firebase
					.retrieve(
						this.firebaseQueryBuilder
							.init()
							.db("anime")
							.inhdd(false)
							.build(),
					)
					.then((data: Array<any>) => {
						this.formatData(data);
						this.dataLoaded = true;
					});
			})
			.catch(() => this.router.navigateByUrl("/login"));
	}

	private formatData(rawData: Array<any>) {
		rawData.forEach((data: any) => {
			const { releaseYear, releaseSeason, watchStatus } = data;

			if (!releaseYear && !releaseSeason) {
				if (!this.data[0]) {
					this.data[0] = { 0: {} };
				}

				if (!this.data[0][0][watchStatus]) {
					this.data[0][0][watchStatus] = [];
				}

				this.data[0][0][watchStatus].push(data);
			}

			if (!this.data[releaseYear]) {
				this.data[releaseYear] = {};
				this.keys[releaseYear] = [];
			}

			switch (releaseSeason) {
				case "Winter":
					this.initializeObject(releaseYear, 0, watchStatus);
					this.data[releaseYear][0][watchStatus].push(data);
					break;
				case "Spring":
					this.initializeObject(releaseYear, 1, watchStatus);
					this.data[releaseYear][1][watchStatus].push(data);
					break;
				case "Summer":
					this.initializeObject(releaseYear, 2, watchStatus);
					this.data[releaseYear][2][watchStatus].push(data);
					break;
				case "Fall":
					this.initializeObject(releaseYear, 3, watchStatus);
					this.data[releaseYear][3][watchStatus].push(data);
					break;
			}
		});

		delete this.data[""];
		delete this.keys[""];
	}

	private initializeObject(
		releaseYear: string,
		releaseSeason: number,
		watchStatus: string,
	) {
		if (!this.data[releaseYear][releaseSeason]) {
			this.data[releaseYear][releaseSeason] = {};

			this.keys[releaseYear].push(releaseSeason);
			this.keys[releaseYear].sort((a: any, b: any) => a - b);
		}

		if (!this.data[releaseYear][releaseSeason][watchStatus]) {
			this.data[releaseYear][releaseSeason][watchStatus] = [];
		}
	}
}
