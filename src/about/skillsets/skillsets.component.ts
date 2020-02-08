import { Component, OnInit } from "@angular/core";

import { FirebaseService } from "@services/firebase.service";

@Component({
	selector: "app-skillsets",
	templateUrl: "./skillsets.component.html",
})
export class SkillsetsComponent implements OnInit {
	constructor(private firebase: FirebaseService) {}

	ngOnInit() {
		this.firebase.retrieveImageUrl("/assets/skillsets.png").then((url) => {
			this.element(".skillset-sprite").forEach((element) => {
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
