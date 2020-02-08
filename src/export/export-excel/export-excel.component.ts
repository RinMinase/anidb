import { Component, OnInit } from "@angular/core";
import { utils, writeFile } from "xlsx";

@Component({
	selector: "app-excel",
	templateUrl: "./export-excel.component.html",
})
export class ExportExcelComponent implements OnInit {
	constructor() {}

	ngOnInit() {}

	exportExcel() {
		const data = [
			{ "Column 1": "Data 1", "Column 2": 44 },
			{ "Column 1": "Data 2", "Column 3": "Another Data" },
		];

		const sheet = utils.json_to_sheet(data);
		const workbook = utils.book_new();

		utils.book_append_sheet(workbook, sheet, "Data");
		writeFile(workbook, "sheet.xlsx");
	}
}
