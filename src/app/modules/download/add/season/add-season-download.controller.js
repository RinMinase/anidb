import moment from "moment";

export class AddSeasonDownloadController {
	constructor($uibModalInstance) {
		"ngInject";

		_.extend(this, {
			$uibModalInstance,

			data: {
				season: "Winter",
				year: moment().year().toString(),
			},
			options: {
				seasons: [
					"Winter",
					"Spring",
					"Summer",
					"Fall",
				],
				years: this._iterateYears(),
			},
		});

		this.activate();
	}

	activate() {

	}

	addSeasonList() {

	}

	cancel() {
		this.$uibModalInstance.close(false);
	}

	_iterateYears() {
		const years = [];
		const limit = 2010;
		const yearToday = moment().year();

		for (let i = yearToday; i >= limit; i--) {
			years.push(i.toString());
		}

		return years;
	}
}
