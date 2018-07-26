export class CSVController {
	constructor () {
		"ngInject";

		_.extend(this, {
			xlsx: XLSX,
		});

		this.activate();
	}

	activate() {

	}

	exportCSV() {
		const data = [
			{ "Column 1": "Data 1", "Column 2": 44 },
			{ "Column 1": "Data 2", "Column 3": "Another Data" },
		];

		const sheet = this.xlsx.utils.json_to_sheet(data);
		const workbook = this.xlsx.utils.book_new();

		this.xlsx.utils.book_append_sheet(workbook, sheet, "Data");
		this.xlsx.writeFile(workbook, "sheet.csv");
	}
}
