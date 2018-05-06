import firebase from "firebase";
import Promise from "bluebird";

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
	};

	return factory;

	function login(email, password) {
		new Promise((resolve) => {
			firebase.auth()
				.signInWithEmailAndPassword(
					email,
					password
				).then(() => {
					resolve();
				});
		});
	}

	function logout() {
		new Promise((resolve) => {
			firebase.auth()
				.signOut()
				.then(() => {
					resolve();
				});
		});
	}

	function auth() {
		return new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged((isAuthenticated) => {
				(isAuthenticated) ? resolve() : reject();
			});
		});
	}

	function create(data) {
		let finalValue;
		const retrieveLast = () => new Promise((resolve) => {
			firebase.database()
				.ref()
				.child("anime")
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
				.ref(`anime/${Object.keys(finalValue)}`)
				.set(data)
				.then(() => {
					resolve();
				});
		});

		retrieveLast()
			.then(dataInsert);
	}

	function retrieve(
		id = "",
		limit = 0,
		orderKey = "",
		orderDesc = false
	) {

		id = id || "";

		limit = (!isNaN(parseInt(limit))) ? parseInt(limit) : 0;

		let orderKeyValid = false;

		if (orderKey || orderKey === "dateFinished") {
			orderKeyValid = true;
		}

		if (!limit && !orderKey) {
			return firebase.database()
				.ref(`/anime${id}`)
				.once("value")
				.then((data) => _objectToArray(data.val()));
		} else if (limit && !orderKey) {
			return firebase.database()
				.ref(`/anime${id}`)
				.limitToLast(limit)
				.once("value")
				.then((data) => _objectToArray(data.val()));
		} else if (!limit && orderKeyValid) {
			if (!orderDesc) {
				return firebase.database()
					.ref(`/anime${id}`)
					.orderByChild(orderKey)
					.once("value")
					.then((data) => _objectToArray(data.val()));
			} else if (orderDesc) {
				return firebase.database()
					.ref(`/anime${id}`)
					.orderByChild(orderKey, "desc")
					.once("value")
					.then((data) => _objectToArray(data.val()));
			}
		} else if (limit && orderKeyValid) {
			if (!orderDesc) {
				return firebase.database()
					.ref(`/anime${id}`)
					.orderByChild(orderKey)
					.limitToLast(limit)
					.once("value")
					.then((data) => _objectToArray(data.val()));
			} else if (orderDesc) {
				return firebase.database()
					.ref(`/anime${id}`)
					.orderByChild(orderKey)
					.limitToLast(limit)
					.once("value")
					.then((data) => _objectToArray(data.val()).reverse());
			}
		}
	}

	function update(id, data) {
		firebase.database()
			.ref(`/anime/${id}`)
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
		if (angular.isObject(data)) {
			const output = [];

			Object.keys(data).map((key, index) => {
				output[index] = data[key];
			});

			return output;
		}

		return data;
	}
}
