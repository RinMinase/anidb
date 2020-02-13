import { Component, OnInit } from "@angular/core";
import { faEnvelope, faPhone } from "@rinminase/ng-fortawesome";
import {
	faBitbucket,
	faFacebookF,
	faGithubAlt,
} from "@rinminase/ng-fortawesome";

@Component({
	selector: "app-developer",
	templateUrl: "./developer.component.html",
})
export class DeveloperComponent implements OnInit {
	faBitbucket = faBitbucket;
	faEnvelope = faEnvelope;
	faFacebook = faFacebookF;
	faGithub = faGithubAlt;
	faPhone = faPhone;

	constructor() {}

	ngOnInit() {}
}
