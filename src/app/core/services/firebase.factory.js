import Promise from "bluebird";
const firebase = Promise.promisifyAll(require("firebase/app"));

import "firebase/auth";
import "firebase/database";
import "firebase/storage";

export function FirebaseFactory() {
	"ngInject";

	const factory = {
		login,
		logout,
		auth,
		create,
		retrieve,
		update,
		softDelete,
		hardDelete,
		retrieveImageUrl,
	};

	return factory;

	function login(email, password) {
		return new Promise((resolve, reject) => {
			firebase.auth()
				.signInWithEmailAndPassword(
					email,
					password
				).then(() => {
					resolve();
				}).catch((error) => {
					reject(error);
				});
		});
	}

	function logout() {
		return new Promise((resolve, reject) => {
			firebase.auth()
				.signOut()
				.then(() => {
					resolve();
				}).catch((error) => {
					reject(error);
				});
		});
	}

	function auth() {
		return new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged((isAuthenticated) => {
				(isAuthenticated) ? resolve() : reject(new Error("Not authenticated"));
			});
		});
	}

	function create(db = "anime", data) {
		let finalValue;
		const retrieveLast = () => new Promise((resolve) => {
			firebase.database()
				.ref()
				.child(db)
				.orderByKey()
				.limitToLast(1)
				.once("value")
				.then((finalData) => {
					finalValue = finalData.val();
					resolve();
				});
		});

		const dataInsert = () => new Promise((resolve) => {
			firebase.database()
				.ref(`${db}/${Object.keys(finalValue)}`)
				.set(data)
				.then(() => {
					resolve();
				});
		});

		retrieveLast()
			.then(dataInsert);
	}

	function retrieve(
		db = "anime",
		id = "",
		limit = 0,
		orderKey = "",
		orderDesc = false
	) {
		id = (id) ? `/${id}` : "";

		limit = (!isNaN(parseInt(limit))) ? parseInt(limit) : 0;

		let orderKeyValid = false;

		if (orderKey || orderKey === "dateFinished") {
			orderKeyValid = true;
		}

		if (!limit && !orderKey) {
			return firebase.database()
				.ref(`/${db}${id}`)
				.once("value")
				.then((data) => _objectToArray(data.val()));
		} else if (limit && !orderKey) {
			return firebase.database()
				.ref(`/${db}${id}`)
				.limitToLast(limit)
				.once("value")
				.then((data) => _objectToArray(data.val()));
		} else if (!limit && orderKeyValid) {
			if (!orderDesc) {
				return firebase.database()
					.ref(`/${db}${id}`)
					.orderByChild(orderKey)
					.once("value")
					.then((data) => _objectToArray(data.val()));
			} else if (orderDesc) {
				return firebase.database()
					.ref(`/${db}${id}`)
					.orderByChild(orderKey, "desc")
					.once("value")
					.then((data) => _objectToArray(data.val()));
			}
		} else if (limit && orderKeyValid) {
			if (!orderDesc) {
				return firebase.database()
					.ref(`/${db}${id}`)
					.orderByChild(orderKey)
					.limitToLast(limit)
					.once("value")
					.then((data) => _objectToArray(data.val()));
			} else if (orderDesc) {
				return firebase.database()
					.ref(`/${db}${id}`)
					.orderByChild(orderKey)
					.limitToLast(limit)
					.once("value")
					.then((data) => _objectToArray(data.val()));
			}
		}
	}

	function update(db, id, data) {
		firebase.database()
			.ref(`/${db}/${id}`)
			.update(data)
			.then(() => {
				resolve();
			});
	}

	function softDelete(id) {
		return id;
	}

	function hardDelete(id) {
		return id;
	}

	function _objectToArray(data) {
		if (!isNaN(Object.keys(data)[0])
			&& angular.isObject(data)) {
			const output = [];

			Object.keys(data).map((key, index) => {
				output[index] = data[key];
			});

			return output;
		}

		return data;
	}

	function retrieveImageUrl(ref) {
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
}
