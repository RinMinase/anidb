import { Component, OnInit } from "@angular/core";
import {
	fabBitbucket,
	fasEnvelope,
	fabFacebookF,
	fabGithubAlt,
} from "@rinminase/ng-fortawesome";

@Component({
	selector: "app-developer",
	templateUrl: "./developer.component.html",
})
export class DeveloperComponent implements OnInit {
	fabBitbucket = fabBitbucket;
	fasEnvelope = fasEnvelope;
	fabFacebook = fabFacebookF;
	fabGithub = fabGithubAlt;

	constructor() {}

	ngOnInit() {}
}
