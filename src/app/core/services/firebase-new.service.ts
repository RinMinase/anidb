import { Injectable } from "@angular/core";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import { FirebaseQuery } from "@builders/firebase-query.service";

@Injectable({
	providedIn: "root",
})
export class FirebaseNewService {

	constructor() { }

	retrieve(params?: FirebaseQuery) {
		const query = params || new FirebaseQuery;
		const idQuery = (query.id) ? `/${query.id}` : "";

		if (!query.limit && !query.orderKey && query.inhdd) {
			return new Promise((resolve) => {
				firebase.database()
					.ref(`/${query.db}${idQuery}`)
					.orderByChild("inhdd")
					.equalTo(1)
					.on("value", (data) => resolve(this._objectToArray(data.val())));
			});
		}

		return Promise.reject();
	}

	private _objectToArray(data: any) {
		if (!isNaN(Object.keys(data)[0] as any)
			&& data.constructor.toString().indexOf("Object") !== -1) {

			const output = [];

			Object.keys(data).map((key, index) => {
				output[index] = data[key];
				output[index].id = parseInt(key, 10);
			});

			return output;
		}

		return data;
	}
}
