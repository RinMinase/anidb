import { Component, OnInit } from "@angular/core";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import {
	faBitbucket,
	faFacebookF,
	faGithubAlt,
} from "@fortawesome/free-brands-svg-icons";

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
