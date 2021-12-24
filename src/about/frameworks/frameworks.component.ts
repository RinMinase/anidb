import { Component, OnInit } from "@angular/core";

import { FirebaseService } from "@services/firebase.service";

@Component({
	selector: "app-frameworks",
	templateUrl: "./frameworks.component.html",
	styleUrls: ["./frameworks.component.scss"],
})
export class FrameworksComponent implements OnInit {
	constructor(private firebase: FirebaseService) {}

	frameworks	= [
		{
			cls: "angular",
			label: "Angular 13",
			url: "https://angular.io",
		},
		{
			cls: "ts",
			label: "Typescript 4.5",
			url: "https://www.typescriptlang.org"
		},
		{
			cls: "scss",
			label: "SCSS",
			url: "https://sass-lang.com"
		},
		{
			cls: "bootstrap",
			label: "Bootstrap 5",
			url: "https://getbootstrap.com"
		},
		{
			cls: "ngb",
			label: "Angular-Bootstrap",
			url: "https://ng-bootstrap.github.io"
		},
		{
			cls: "firebase",
			label: "Firebase",
			url: "https://firebase.google.com"
		},
		{
			cls: "webpack",
			label: "Webpack",
			url: "https://webpack.js.org"
		},
		{
			cls: "cordova",
			label: "Cordova",
			url: "https://cordova.apache.org"
		},
		{
			cls: "circle",
			label: "Circle CI",
			url: "https://circleci.com"
		},
	]

	ngOnInit() {
		this.firebase.retrieveImageUrl("/assets/ngx-frameworks.png").then((url) => {
			this.element("a.frameworks").forEach((element) => {
				element.style.backgroundImage = `url(${url})`;
			});
		});
	}

	private element(querySelector: string) {
		return (window.document.querySelectorAll(
			querySelector,
		) as unknown) as Array<HTMLElement>;
	}
}
