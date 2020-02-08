import { Component, OnInit } from "@angular/core";

import { FileUploader } from "ng2-file-upload";

@Component({
	selector: "app-sample-upload",
	templateUrl: "./sample-upload.component.html",
	styleUrls: ["./sample-upload.component.scss"],
})
export class SampleUploadComponent implements OnInit {
	uploader: FileUploader = new FileUploader({ url: "" });
	hasBaseDropZoneOver: boolean = false;
	hasAnotherDropZoneOver: boolean = false;

	constructor() {}

	ngOnInit() {}

	displayUploadProps() {
		const { log } = console;
		this.uploader.queue.forEach((q) => {
			const { lastModified, name, size, type } = q._file;
			log({ lastModified, name, size, type });
		});
	}

	fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}

	fileOverAnother(e: any): void {
		this.hasAnotherDropZoneOver = e;
	}
}
