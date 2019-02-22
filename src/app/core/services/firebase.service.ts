import { Injectable } from "@angular/core";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import { FirebaseQuery } from "@builders/firebase-query.service";

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

	retrieve(params?: FirebaseQuery) {
		const query = params || new FirebaseQuery;
		const idQuery = (query.id) ? `/${query.id}` : "";

		if (!query.limit && !query.orderKey) {
			if (idQuery) { return this.retrieveSpecific(query, idQuery); }
			return (!query.inhdd) ? this.retrieveAll(query) : this.retrieveAllInHDD(query);
		} else if (query.limit && query.orderKey) {
			if (query.orderDirection === "asc") { return this.retrieveWithAscQuery(query); }
			return this.retrieveWithDescQuery(query);
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

	private retrieveAll(query: FirebaseQuery) {
		return new Promise((resolve) => {
			firebase.database()
				.ref(`/${query.db}`)
				.on("value", (data) => resolve(this.objectToArray(data.val())));
		});
	}

	private retrieveAllInHDD(query: FirebaseQuery) {
		return new Promise((resolve) => {
			firebase.database()
				.ref(`/${query.db}`)
				.orderByChild("inhdd")
				.equalTo(1)
				.on("value", (data) => resolve(this.objectToArray(data.val())));
		});
	}

	private retrieveSpecific(query: FirebaseQuery, idQuery: string) {
		return new Promise((resolve) => {
			firebase.database()
				.ref(`/${query.db}${idQuery}`)
				.on("value", (data) => resolve(this.objectToArray(data.val())));
		});
	}

	private retrieveWithAscQuery(query: FirebaseQuery) {
		return new Promise((resolve) => {
			firebase.database()
				.ref(`/${query.db}`)
				.orderByChild(query.orderKey)
				.limitToFirst(query.limit)
				.on("value", (data) => resolve(this.objectToArray(data.val())));
		});
	}

	private retrieveWithDescQuery(query: FirebaseQuery) {
		return new Promise((resolve) => {
			firebase.database()
				.ref(`/${query.db}`)
				.orderByChild(query.orderKey)
				.limitToLast(query.limit)
				.on("value", (data) => resolve(this.objectToArray(data.val())));
		});
	}

	private objectToArray(data: any) {
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
