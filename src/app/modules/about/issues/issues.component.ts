import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-issues",
	templateUrl: "./issues.component.html",
	styleUrls: ["./issues.component.scss"],
})
export class IssuesComponent implements OnInit {

	@Input() githubIssues: Array<any>;
	@Input() packageIssues: any;
	@Input() transitionProgress: any;

	pageSize = 10;
	page = 1;

	constructor() { }

	ngOnInit() {
	}

}
