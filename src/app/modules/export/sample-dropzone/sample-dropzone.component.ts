import { Component, OnInit, ViewChild } from "@angular/core";
import { DropzoneComponent } from "ngx-dropzone-wrapper";

@Component({
	selector: "app-sample-dropzone",
	templateUrl: "./sample-dropzone.component.html",
	styleUrls: ["./sample-dropzone.component.scss"],
})
export class SampleDropzoneComponent implements OnInit {

	@ViewChild(DropzoneComponent) componentRef?: DropzoneComponent;

	log: any;
	config: any;

	constructor() { }

	ngOnInit() {
		const { log } = console;
		this.log = log;
	}

	onUploadInit(event: any) {
		this.log("Upload Init", event);
	}

	onUploadError(event: any) {
		this.log("Upload Error", event);
	}

	onUploadSuccess(event: any) {
		this.log("Upload Success", event);
	}

}
