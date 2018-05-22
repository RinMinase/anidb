import _ from "lodash";

export function GithubApiFactory($http) {
	"ngInject";

	_.extend(this, {
		$http,
	});

	const factory = {
		getCommits,
		getIssues,
	};

	return factory;

	function getCommits() {

	}

	function getIssues() {

	}
}
