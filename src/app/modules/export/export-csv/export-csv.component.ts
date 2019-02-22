import { Component, OnInit } from "@angular/core";

import * as xlsx from "xlsx";

@Component({
	selector: "app-csv",
	templateUrl: "./export-csv.component.html",
})
export class ExportCsvComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

	exportCSV() {
		const data = [
			{ "Column 1": "Data 1", "Column 2": 44 },
			{ "Column 1": "Data 2", "Column 3": "Another Data" },
		];

		const sheet = xlsx.utils.json_to_sheet(data);
		const workbook = xlsx.utils.book_new();

		xlsx.utils.book_append_sheet(workbook, sheet, "Data");
		xlsx.writeFile(workbook, "sheet.csv");
	}

}
