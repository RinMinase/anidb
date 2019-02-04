import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/core/services/firebase.service";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {

	userImage: string;
	dataLoaded = false;

	constructor(
		private firebase: FirebaseService,
	) { }

	ngOnInit() {
		this._getFirebaseImages();
	}

	private _getFirebaseImages() {
		this.firebase.retrieveImageUrl("/assets/acknowledgements.png")
			.then((url) => {
				this._element(".anidb-about div.acknowledgements")
					.forEach(element => {
						element.style.backgroundImage = `url(${url})`;
					});
			});

		this.firebase.retrieveImageUrl("/assets/frameworks.png")
			.then((url) => {
				this._element(".anidb-about a.frameworks")
					.forEach(element => {
						element.style.backgroundImage = `url(${url})`;
					});
			});

		this.firebase.retrieveImageUrl("/assets/platforms.png")
			.then((url) => {
				this._element(".anidb-about a.platforms")
					.forEach(element => {
						element.style.backgroundImage = `url(${url})`;
					});
			});

		this.firebase.retrieveImageUrl("/assets/user.jpg")
			.then((url) => {
				this.userImage = url as string;
			});
	}

	private _element(querySelector: string) {
		return window.document.querySelectorAll(querySelector) as unknown as Array<HTMLElement>;
	}

}
