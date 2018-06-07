export function githubConstants() {
	const githubApi = "https://api.github.com/repositories/127729588";

	return {
		commits: `${githubApi}/commits?per_page=20`,
		issues: `${githubApi}/issues?page=1&per_page=100`,
	};
}
