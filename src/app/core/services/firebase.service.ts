import { Injectable } from "@angular/core";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

@Injectable({
	providedIn: "root",
})
export class FirebaseService {

	constructor() { }

	login(email: string, password: string) {
		return Promise.resolve(firebase.auth().signInWithEmailAndPassword(email, password))
			.catch((error) => Promise.reject(error));
	}

	logout() {
		return Promise.resolve(firebase.auth().signOut())
			.catch((error) => Promise.reject(error));
	}

	auth() {
		return new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged((isAuthenticated: any) => {
				(isAuthenticated) ? resolve() : reject(new Error("Not authenticated"));
			});
		});
	}

	retrieve(
		db = "anime",
		id = "",
		limit = 0,
		orderKey = "",
		orderDesc = false,
		inhdd = true,
	) {

		id = (id) ? `/${id}` : "";
		limit = (!isNaN(limit)) ? limit : 0;

		let orderKeyValid = false;
		const inHddValue = (inhdd && db === "anime") ? 1 : 0;

		if (orderKey || orderKey === "dateFinished") {
			orderKeyValid = true;
		}

		firebase.database().ref(`/${db}${id}`).on("value", () => {});

		if (id === "" && !limit && !orderKey && inHddValue) {
			return firebase.database()
				.ref(`/${db}${id}`)
				.orderByChild("inhdd")
				.equalTo(1)
				.once("value")
				.then((data) => this._objectToArray(data.val()));
		}

		return Promise.reject();
	}

	retrieveImageUrl(ref: string) {
		return new Promise((resolve, reject) => {
			firebase.storage()
				.ref(ref)
				.getDownloadURL()
				.then((url) => {
					resolve(url);
				}).catch((error) => {
					switch (error.code) {
						case "storage/object_not_found":
							reject("File doesn't exist");
							break;
						case "storage/unauthorized":
							reject("User doesn't have permission to access the object");
							break;
						case "storage/canceled":
							reject("User canceled the upload");
							break;
						case "storage/unknown":
							reject("Unknown error occurred");
							break;
					}
				});
		});
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
