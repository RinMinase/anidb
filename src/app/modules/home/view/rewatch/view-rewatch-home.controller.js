import extend from "lodash/extend";
import moment from "moment-mini";

export class ViewRewatchHomeController {
	constructor(
		$state,
		$uibModalInstance,
		firebase,
		id,
		rewatch
	) {
		"ngInject";

		extend(this, {
			$state,
			$uibModalInstance,
			firebase,
			id,
			rewatch,

			data: {},
			dataRewatch: [],
		});

		this._polyfillArrayIncludes();
		this.activate();
	}

	activate() {
		if (this.rewatch.length) {
			this.rewatch = this.rewatch.split(",");
			this.rewatch.forEach((value, index) => {
				this.rewatch[index] = parseInt(value);
			});
			this._formatRewatch();
		}
	}

	add() {
		this.data.date = this._autofillYear(this.raw.date);

		if (!this.rewatch.includes(this.data.date)) {
			this.rewatch.push(this.data.date);
			this.rewatch.sort((a, b) => b - a);
			this.firebase.update("anime", this.id, {
				rewatch: this.rewatch.toString(),
				rewatchLast: this.rewatch[0],
			});
			this._formatRewatch();
		}
	}

	cancel() {
		this.$uibModalInstance.close(false);
		this.$state.reload();
	}

	delete(id) {
		this.rewatch.splice(id, 1);
		this.firebase.update("anime", this.id, {
			rewatch: this.rewatch.toString(),
			rewatchLast: this.rewatch[0] || "",
		});
		this._formatRewatch();
	}

	_autofillYear(date) {
		if (date.split(" ").length === 2) {
			const monthRaw = parseInt(date.split(" ")[0]) || date.split(" ")[0];
			const day = parseInt(date.split(" ")[1]) || date.split(" ")[1];
			let month;

			if (isNaN(monthRaw)) {
				month = parseInt(moment(monthRaw, "MMM").format("MM"));
			} else {
				month = parseInt(moment(monthRaw, "MM").format("MM"));
			}

			const yearToday = moment().year();
			const dateParsed = `${month} ${day} ${yearToday}`;
			const dateParsedUnix = moment(dateParsed, "MM D YYYY").unix();
			const dateTodaytUnix = moment().unix();

			if (dateParsedUnix > dateTodaytUnix) {
				date += ` ${(moment().year() - 1).toString()}`;
			} else {
				date += ` ${(moment().year()).toString()}`;
			}
		}

		if ((new Date(date)).toString().indexOf("Invalid Date") === 0) {
			return moment().unix();
		} else {
			return moment(new Date(date)).unix();
		}
	}

	_formatRewatch() {
		this.dataRewatch = [];
		if (this.rewatch.length > 0) {
			this.rewatch.forEach((value, index) => {
				this.dataRewatch[index] = moment.unix(value).format("MMM DD, YYYY");
			});
		}
	}

	_polyfillArrayIncludes() {
		if (!Array.prototype.includes) {
			Object.defineProperty(Array.prototype, "includes", {
				value: (searchElement, fromIndex) => {
					const o = Object(this);
					const len = o.length >>> 0;

					if (len === 0) {
						return false;
					}

					const n = fromIndex | 0;
					let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

					function sameValueZero(x, y) {
						return x === y
							|| (typeof x === "number"
							&& typeof y === "number"
							&& isNaN(x)
							&& isNaN(y));
					}

					while (k < len) {
						if (sameValueZero(o[k], searchElement)) {
							return true;
						}
						k++;
					}

					return false;
				},
			});
		}
	}
}
