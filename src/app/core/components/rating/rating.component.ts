import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: "app-rating",
	templateUrl: "./rating.component.html",
	styleUrls: ["./rating.component.scss"],
})
export class RatingComponent implements OnInit {

	@Output() ratingChange = new EventEmitter<{
		audio: number,
		enjoyment: number,
		graphics: number,
		plot: number,
	}>();

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

	changeRating() {
		this.calculateOverall();
		this.ratingChange.emit({
			audio: this.audio,
			enjoyment: this.enjoyment,
			graphics: this.graphics,
			plot: this.plot,
		});
	}

	private calculateOverall() {
		this.overall = (this.audio + this.enjoyment + this.graphics + this.plot) / 8;
	}

}
