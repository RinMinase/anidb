export function githubConstants() {
	const githubApi = "https://api.github.com/repos/RinMinase/anidb-angular";
	const githubApiOld = "https://api.github.com/repos/RinMinase/anidb";

	return {
		commits: `${githubApi}/commits?per_page=20`,
		issues: `${githubApiOld}/issues?page=1&per_page=100`,
	};
}
