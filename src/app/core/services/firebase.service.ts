import { Injectable } from "@angular/core";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

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
}
