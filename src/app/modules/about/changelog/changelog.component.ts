import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-changelog",
	templateUrl: "./changelog.component.html",
	styleUrls: ["./changelog.component.scss"],
})
export class ChangelogComponent implements OnInit {

	@Input() githubCommits: Array<any>;

	constructor() { }

	ngOnInit() {
	}

}
