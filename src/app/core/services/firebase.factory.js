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
		increaseCacheControl,
		retrieveImageUrl,
	};

	return factory;

	function login(email, password) {
		return Promise.resolve(firebase.auth().signInWithEmailAndPassword(email, password))
			.catch((error) => Promise.reject(error));
	}

	function logout() {
		return Promise.resolve(firebase.auth().signOut())
			.catch((error) => Promise.reject(error));
	}

	function auth() {
		return new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged((isAuthenticated) => {
				(isAuthenticated) ? resolve() : reject(new Error("Not authenticated"));
			});
		});
	}

	function create(db = "anime", data) {
		let lastIndex;
		const retrieveLast = () => new Promise((resolve) => {
			firebase.database()
				.ref()
				.child(db)
				.orderByKey()
				.limitToLast(1)
				.once("value")
				.then((finalData) => {
					lastIndex = parseInt(Object.keys(finalData.val()));
					resolve();
				});
		});

		const dataInsert = () => new Promise((resolve) => {
			firebase.database()
				.ref(`${db}/${lastIndex + 1}`)
				.set(data)
				.then(() => {
					resolve();
				});
		});

		return retrieveLast()
			.then(dataInsert);
	}

	function retrieve(
		db = "anime",
		id = "",
		limit = 0,
		orderKey = "",
		orderDesc = false,
		inhdd = true
	) {
		id = (id) ? `/${id}` : "";

		limit = (!isNaN(parseInt(limit))) ? parseInt(limit) : 0;

		let orderKeyValid = false;
		const inHddValue = (inhdd && db === "anime") ? 1 : 0;

		if (orderKey || orderKey === "dateFinished") {
			orderKeyValid = true;
		}

		firebase.database().ref(`/${db}${id}`).on("value", () => {});

		if (!limit && !orderKey && inHddValue) {
			return firebase.database()
				.ref(`/${db}${id}`)
				.orderByChild("inhdd")
				.equalTo(1)
				.once("value")
				.then((data) => _objectToArray(data.val()));
		} else if (!limit && !orderKey && !inHddValue) {
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
					.orderByChild(orderKey, "desc")
					.limitToLast(limit)
					.once("value")
					.then((data) => _objectToArray(data.val()));
			}
		}

		return Promise.reject();
	}

	function update(db, id, data) {
		return Promise.resolve(firebase.database()
			.ref(`/${db}/${id}`)
			.update(data));
	}

	function softDelete(id) {
		return id;
	}

	function hardDelete(db = "anime", id) {
		return Promise.resolve(firebase.database()
			.ref(`/${db}/${id}`)
			.remove());
	}

	function _objectToArray(data) {
		if (!isNaN(Object.keys(data)[0])
			&& data.constructor.toString().indexOf("Object") !== -1) {

			const output = [];

			Object.keys(data).map((key, index) => {
				output[index] = data[key];
			});

			return output;
		}

		return data;
	}

	function increaseCacheControl(ref) {
		return new Promise((resolve, reject) => {
			firebase.storage()
				.ref(ref)
				.updateMetadata({
					cacheControl: "public,max-age=31536000",
				})
				.then(() => {
					resolve();
				}).catch((error) => {
					reject(error);
				});
		});
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
