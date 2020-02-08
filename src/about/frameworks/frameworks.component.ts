import { Component, OnInit } from "@angular/core";

import { FirebaseService } from "@services/firebase.service";

@Component({
	selector: "app-frameworks",
	templateUrl: "./frameworks.component.html",
	styleUrls: ["./frameworks.component.scss"],
})
export class FrameworksComponent implements OnInit {
	constructor(private firebase: FirebaseService) {}

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
