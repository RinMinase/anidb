import { Injectable } from "@angular/core";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";
import "firebase/compat/firestore";

import { FirebaseQuery } from "@builders/firebase-query.service";
import { v4 as uuid } from "uuid";

// const fb = firebase.database;
const fs = firebase.firestore;

@Injectable({
	providedIn: "root",
})
export class FirebaseService {
	constructor() {}

	login(email: string, password: string) {
		return Promise.resolve(
			firebase.auth().signInWithEmailAndPassword(email, password),
		).catch((error) => Promise.reject(error));
	}

	logout() {
		return Promise.resolve(firebase.auth().signOut()).catch((error) =>
			Promise.reject(error),
		);
	}

	auth() {
		return new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged((isAuthenticated: any) => {
				isAuthenticated
					? resolve(true)
					: reject(new Error("Not authenticated"));
			});
		});
	}

	create(db = "anime", data: any) {
		let lastIndex: number;
		const retrieveLast = () =>
			new Promise((resolve) => {
				firebase
					.database()
					.ref(db)
					.orderByKey()
					.limitToLast(1)
					.once("value")
					.then((finalData: any) => {
						lastIndex = parseInt(Object.keys(finalData.val())[0]);
						resolve(true);
					});
			});

		const dataInsert = () =>
			new Promise((resolve) => {
				firebase
					.database()
					.ref(`${db}/${lastIndex + 1}`)
					.set(data)
					.then(async () => {
						await firebase
							.database()
							.ref("/config/uuid")
							.set(uuid());

						resolve(true);
					});
			});

		return retrieveLast().then(dataInsert);
	}

	hardDelete(params: FirebaseQuery) {
		const { db, id } = params;
		if (db && id) {
			return Promise.resolve(firebase.database().ref(`/${db}/${id}`).remove());
		}

		return Promise.reject();
	}

	retrieve(params?: FirebaseQuery) {
		const query = params || new FirebaseQuery();
		const idQuery = query.id ? `/${query.id}` : "";

		if (!query.limit && !query.orderKey) {
			if (idQuery) {
				return this.retrieveSpecific(query, idQuery);
			}
			return !query.inhdd
				? this.retrieveAll(query)
				: this.retrieveAllInHDD(query);
		} else if (query.limit && query.orderKey) {
			if (query.orderDirection === "asc") {
				return this.retrieveWithAscQuery(query);
			}

			return this.retrieveWithDescQuery(query);
		}

		return Promise.reject();
	}

	retrieveUUID() {
		return new Promise(async (resolve) => {
			// firebase
			// 	.database()
			// 	.ref("/config/uuid")
			// 	.on("value", (data) => resolve(data));

			const storeID = await firebase
				.firestore()
				.collection("config")
				.doc("uuid")
				.get();

			if (storeID.exists) {
				resolve(storeID.data());
			} else {
				resolve("");
			}
		});
	}

	retrieveImageUrl(ref: string) {
		return new Promise((resolve, reject) => {
			firebase
				.storage()
				.ref(ref)
				.getDownloadURL()
				.then((url) => {
					resolve(url);
				})
				.catch((error) => {
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
			return Promise.resolve(
				firebase
					.database()
					.ref(`/${db}/${id}`)
					.update(data)
					.then(async () => {
						await firebase
							.database()
							.ref("/config/uuid")
							.set(uuid())
					})
			);
		}

		return Promise.reject();
	}

	private async retrieveAll(query: FirebaseQuery) {
		const currID = localStorage.getItem("uuid");
		const currData = localStorage.getItem("data");

		const snapshot = await firebase.database().ref("/config/uuid").once("value")
		const storageID = snapshot.val();

		if (currID && currData && currID === storageID) {
			return Promise.resolve(JSON.parse(currData));
		} else {
			return new Promise((resolve) => {
				firebase
					.database()
					.ref(`/${query.db}`)
					.on("value", (data) => {
						const parsed = this.objectToArray(data.val());

						localStorage.setItem("uuid", storageID);
						localStorage.setItem("data", JSON.stringify(parsed));

						resolve(parsed);
					});
			});
		}
	}

	private async retrieveAllInHDD(query: FirebaseQuery) {
		const currID = localStorage.getItem("uuid");
		const currData = localStorage.getItem("data");

		const storeIDdoc = await fs().collection("config").doc("uuid").get();
		let storeID = "";

		if (storeIDdoc.exists) {
			storeID = `${storeIDdoc.data().value}`;
		}

		if (currID && currData && storeID && currID === storeID) {
			return Promise.resolve(JSON.parse(currData));
		} else {
			return new Promise((resolve) => {
				firebase
					.database()
					.ref(`/${query.db}`)
					.orderByChild("inhdd")
					.equalTo(1)
					.on("value", (data) => {
						const parsed = this.objectToArray(data.val());

						localStorage.setItem("uuid", storeID);
						localStorage.setItem("data", JSON.stringify(parsed));

						resolve(parsed);
					});
			});
		}
	}

	private retrieveSpecific(query: FirebaseQuery, idQuery: string) {
		return new Promise((resolve) => {
			firebase
				.database()
				.ref(`/${query.db}${idQuery}`)
				.on("value", (data) => resolve(this.objectToArray(data.val())));
		});
	}

	private retrieveWithAscQuery(query: FirebaseQuery) {
		return new Promise((resolve) => {
			firebase
				.database()
				.ref(`/${query.db}`)
				.orderByChild(query.orderKey)
				.limitToFirst(query.limit)
				.on("value", (data) => resolve(this.objectToArray(data.val())));
		});
	}

	private retrieveWithDescQuery(query: FirebaseQuery) {
		return new Promise((resolve) => {
			firebase
				.database()
				.ref(`/${query.db}`)
				.orderByChild(query.orderKey)
				.limitToLast(query.limit)
				.on("value", (data) => resolve(this.objectToArray(data.val())));
		});
	}

	private objectToArray(data: any): Array<any> {
		if (!data) {
			return null;
		}

		if (!isNaN(Object.keys(data)[0] as any)) {
			const output: Array<any> = [];

			Object.keys(data).forEach((key, index) => {
				output[index] = data[key];
				output[index].id = parseInt(key);
			});

			return output;
		}

		return data;
	}
}
