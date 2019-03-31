import { Component, OnInit, ViewChild } from "@angular/core";
import { DropzoneComponent } from "ngx-dropzone-wrapper";

@Component({
	selector: "app-sample-dropzone",
	templateUrl: "./sample-dropzone.component.html",
	styleUrls: ["./sample-dropzone.component.scss"],
})
export class SampleDropzoneComponent implements OnInit {

	@ViewChild(DropzoneComponent) dz?: DropzoneComponent;

	log: any;
	config: any;
	currentFile: any;

	constructor() { }

	ngOnInit() {
		const { log } = console;
		this.log = log;
	}

	onUploadInit(event: any) {
		this.log("Upload Init", event);
	}

	onAddedFile(event: any) {
		this.log("Added File", event);
		this.log("dz", this.dz);
	}

	onProcessing(event: any) {
		this.log("Processing", event);
	}

	onUploadError(event: any) {
		this.log("Upload Error", event);
	}

	onUploadSuccess(event: any) {
		this.log("Upload Success", event);
	}

}
