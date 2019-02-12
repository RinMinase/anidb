import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class FirebaseQueryService {
	firebaseOptions = {
		db: "anime",
		id: null,
		limit: null,
		orderKey: null,
		orderDirection: null,
		inhdd: 1,
	};

	validOrderKeys = [
		"dateFinished",
	];

	constructor() { }

	db(value: string) {
		this.firebaseOptions.db = value;
		return this;
	}

	id(value: number) {
		this.firebaseOptions.id = value;
		return this;
	}

	limit(value: number) {
		this.firebaseOptions.limit = value;
		return this;
	}

	order(key: string, direction: string) {
		if (this.validOrderKeys.includes(key)) {
			this.firebaseOptions.orderDirection = (direction === "desc") ? direction : "asc";
			this.firebaseOptions.orderKey = key;
		}
		return this;
	}

	inhdd(value: boolean) {
		this.firebaseOptions.inhdd = (value) ? 1 : 0;
		return this;
	}

	build() {
		return this.firebaseOptions;
	}
}

export class FirebaseQuery {
	db?: string;
	id?: number;
	limit?: number;
	orderKey?: string;
	orderDirection?: string;
	inhdd?: number;

	constructor() {
		this.db = "anime";
		this.id = null;
		this.limit = null;
		this.orderKey = null;
		this.orderDirection = null;
		this.inhdd = 1;
	}
}
