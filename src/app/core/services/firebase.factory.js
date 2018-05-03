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
		new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged((isAuthenticated) => {
				if (isAuthenticated) {
					resolve();
				} else {
					reject();
				}
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

	function retrieve(id = "") {
		if (id !== "") {
			id = `/${id}`;
		}

		new Promise((resolve) => {
			firebase.database()
				.ref(`/anime${id}`)
				.once("value")
				.then((data) => {
					resolve();

					return data;
				});
		});
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
}
