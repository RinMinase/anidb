import Promise from "bluebird";

export function GithubApiFactory(
	$http,
	GITHUB_API
) {
	"ngInject";

	const factory = {
		getCommits,
		getIssues,
	};

	return factory;

	function getCommits() {
		return Promise.resolve($http.get(GITHUB_API.commits, { cache: true }))
			.then((response) => response)
			.catch((error) => {
				Promise.reject(error);
			});
	}

	function getIssues() {
		return Promise.resolve($http.get(GITHUB_API.issues, { cache: true }))
			.then((response) => response)
			.catch((error) => {
				Promise.reject(error);
			});
	}
}
