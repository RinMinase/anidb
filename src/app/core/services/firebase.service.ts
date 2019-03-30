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

	create(db = "anime", data: any) {
		let lastIndex: number;
		const retrieveLast = () => new Promise((resolve) => {
			firebase.database()
				.ref(db)
				.orderByKey()
				.limitToLast(1)
				.once("value")
				.then((finalData: any) => {
					lastIndex = parseInt(Object.keys(finalData.val())[0]);
					resolve();
				});
		});

		const dataInsert = () => new Promise((resolve) => {
			firebase.database()
				.ref(`${db}/${lastIndex + 1}`)
				.set(data)
				.then(() => { resolve(); });
		});

		return retrieveLast()
			.then(dataInsert);
	}

	hardDelete(params: FirebaseQuery) {
		const { db, id } = params;
		if (db && id) {
			return Promise.resolve(firebase.database()
				.ref(`/${db}/${id}`)
				.remove());
		}

		return Promise.reject();
	}

	retrieve(params?: FirebaseQuery) {
		const query = params || new FirebaseQuery();
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

	update(params: FirebaseQuery) {
		const { db, id, data } = params;
		if (db && id && data) {
			return Promise.resolve(firebase.database()
				.ref(`/${db}/${id}`)
				.update(data));
		}

		return Promise.reject();
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
		if (!data) { return null; }

		if (!isNaN(Object.keys(data)[0] as any)
			&& data.constructor.toString().indexOf("Object") !== -1) {

			const output = [];

			Object.keys(data).forEach((key, index) => {
				output[index] = data[key];
				output[index].id = parseInt(key);
			});

			return output;
		}

		return data;
	}
}
