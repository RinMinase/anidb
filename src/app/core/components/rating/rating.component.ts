import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-rating",
	templateUrl: "./rating.component.html",
	styleUrls: ["./rating.component.scss"],
})
export class RatingComponent implements OnInit {

	@Input() audio: number;
	@Input() enjoyment: number;
	@Input() graphics: number;
	@Input() plot: number;

	overall: number;

	constructor() { }

	ngOnInit() {
		if (!this.audio) { this.audio = 0; }
		if (!this.enjoyment) { this.enjoyment = 0; }
		if (!this.graphics) { this.graphics = 0; }
		if (!this.plot) { this.plot = 0; }

		this.calculateOverall();
	}

	calculateOverall() {
		this.overall = (this.audio + this.enjoyment + this.graphics + this.plot) / 4;
	}

}
