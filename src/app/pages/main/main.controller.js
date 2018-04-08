"use strict";

import  _ from "lodash/core";
import moment from "moment";
import firebase from "firebase";
import angularLogo from "_images/angular.png";

export default class MainController {
	constructor($log) {
		"ngInject";
		this.$log = $log;
	}

	$onInit() {
		this.lodashVersion = _.VERSION;
		this.momentVersion = moment.version;
		this.firebaseVersion = firebase.SDK_VERSION;
		this.angularLogo = angularLogo;

		const config = {
			apiKey: "AIzaSyAMevBdhrcoIGlNddR0UMgdgnJUO_GhZc4",
			authDomain: "rin-anidb.firebaseapp.com",
			databaseURL: "https://rin-anidb.firebaseio.com",
			projectId: "rin-anidb",
			storageBucket: "rin-anidb.appspot.com",
			messagingSenderId: "669722574117",
		};

		firebase.initializeApp(config);

		firebase.auth()
			.signInWithEmailAndPassword(
				"testing@test.com",
				"testing"
			).then(() => {
				// eslint-disable-next-line
				console.log("Successfully logged in to firebase!");
			});

		firebase.auth().onAuthStateChanged((isAuthenticated) => {
			if (isAuthenticated) {
				const dataDump = {
					quality: "4k 2160p",
					title: "Kimi no Na Wa",
					episodes: 1,
					ovas: 0,
					specials: 0,
					filesize: 209715200,
					seasonNumber: 1,
					firstSeasonTitle: "Kimi no Na Wa",
					prequel: "",
					sequel: "",
					offquel: "",
					dateFinished: 1523232000,
					releaseSeason: "Fall",
					releaseYear: "2013",
					duration: 7200,
					encoder: "Coalgirls",
					variants: "",
					remarks: "",
					rating: {
						audio: 7,
						enjoyment: 7,
						graphics: 7,
						plot: 7,
					},
				};

				firebase.database()
					.ref("anime/" + "1")
					.set(dataDump)
					.then(() => {
						// eslint-disable-next-line
						console.log("Successfully inserted data in firebase!");
					});

				firebase.database()
					.ref("/anime/1")
					.once("value")
					.then((data) => {
						// eslint-disable-next-line
						console.log(data.val());

						// eslint-disable-next-line
						console.log("Successfully retrieved data in firebase!");
					});

				const updateDataDump = {
					quality: "FHD 1080p",
				};

				firebase.database()
					.ref("/anime/1")
					.update(updateDataDump);

				firebase.database()
					.ref("/anime/1")
					.once("value")
					.then((data) => {
						// eslint-disable-next-line
						console.log(data.val());

						// eslint-disable-next-line
						console.log("Successfully updated data in firebase!");
					});

				firebase.auth()
					.signOut()
					.then(() => {
						// eslint-disable-next-line
						console.log("Successfully logged out in firebase!");
					});
			} else {
				// eslint-disable-next-line
				console.log("Not logged-in in firebase!");
			}
		});
	}
}
