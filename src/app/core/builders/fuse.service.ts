import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class FuseService {
	fuseOptions = {
		shouldSort: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: [],
	};

	constructor() { }

	addKeys(value: string) {
		if (!this.fuseOptions.keys) { this.fuseOptions.keys = []; }
		this.fuseOptions.keys.push(value);
		return this;
	}

	distance(value: number) {
		this.fuseOptions.distance = value;
		return this;
	}

	location(value: number) {
		this.fuseOptions.location = value;
		return this;
	}

	maxPatternLength(value: number) {
		this.fuseOptions.maxPatternLength = value;
		return this;
	}

	minMatchCharLength(value: number) {
		this.fuseOptions.minMatchCharLength = value;
		return this;
	}

	shouldSort(value: boolean) {
		this.fuseOptions.shouldSort = value;
		return this;
	}

	threshold(value: number) {
		this.fuseOptions.threshold = value;
		return this;
	}

	build() {
		return this.fuseOptions;
	}
}
