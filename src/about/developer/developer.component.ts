import { Component, OnInit } from "@angular/core";
import {
	fabBitbucket,
	fasEnvelope,
	fabFacebookF,
	fabGithubAlt,
	fasPhone,
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
	fasPhone = fasPhone;

	constructor() {}

	ngOnInit() {}
}
