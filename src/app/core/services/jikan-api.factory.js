import Promise from "bluebird";

export function JikanApiFactory() {
	"ngInject";

	const jikanApi = "https://api.jikan.moe/v3";
	const factory = {
		getData,
		searchData,
	};

	return factory;

	function getData(id) {
		return Promise.resolve(`${jikanApi}/anime${id}`)
			.catch((error) => Promise.reject(error));
	}

	function searchData(query, limit = 1) {
		return Promise.resolve(`${jikanApi}/search/anime?q=${encodeURI(query)}&limit=${limit}`)
			.catch((error) => Promise.reject(error));
	}
}
