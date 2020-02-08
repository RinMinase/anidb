import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class GithubService {
	githubApi = "https://api.github.com/repos/RinMinase/anidb";
	commits = `${this.githubApi}/commits?per_page=20`;
	issues = `${this.githubApi}/issues?page=1&per_page=100`;
	branch = "ngx";
	branchCommits = `${this.commits}&sha=${this.branch}`;

	constructor(private http: HttpClient) {}

	getCommits(): Observable<any> {
		return this.http.get(this.commits, { observe: "response" });
	}

	getBranchCommits(): Observable<any> {
		return this.http.get(this.branchCommits, { observe: "response" });
	}

	getIssues(): Observable<any> {
		return this.http.get(this.issues, { observe: "response" });
	}
}
