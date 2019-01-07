import Promise from "bluebird";

export function JikanApiFactory() {
	"ngInject";

	const jikanApi = "https://api.jikan.moe/v3";
	const factory = {
		getData,
	}

	return factory;

	function getData(id) {
		return Promise.resolve(`${jikanApi}/anime${id}`)
			.catch((error) => Promise.reject(error));
	}
}
