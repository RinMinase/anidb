import { Injectable } from "@angular/core";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import { FirebaseQueryService, FirebaseQuery } from "@builders/firebase-query.service";

@Injectable({
	providedIn: "root",
})
export class FirebaseNewService {

	constructor() { }

	retrieve(params?: FirebaseQueryService) {
		const query = (params) ? params.firebaseOptions : new FirebaseQuery;
		const idQuery = (query.id) ? `/${query.id}` : "";

		firebase.database().ref(`/${query.db}${query.id}`).on("value", () => {});

		if (!query.limit && !query.orderKey && query.inhdd) {
			return firebase.database()
				.ref(`/${query.db}${idQuery}`)
				.orderByChild("inhdd")
				.equalTo(1)
				.once("value")
				.then((data) => this._objectToArray(data.val()));
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
