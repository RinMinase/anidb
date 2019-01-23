import extend from "lodash/extend";

export function FuseOptionsBuilder() {
	"ngInject";

	const fuseOptions = {};
	const factory = {
		addKeys,
		build,
		distance,
		init,
		location,
		maxPatternLength,
		minMatchCharLength,
		shouldSort,
		threshold,
	};

	return factory;

	function init(cleanObject = false) {
		if (!cleanObject) {
			extend(fuseOptions, {
				shouldSort: true,
				threshold: 0.6,
				location: 0,
				distance: 100,
				maxPatternLength: 32,
				minMatchCharLength: 1,
				keys: [],
			});
		}

		return this;
	}

	function addKeys(value) {
		if (typeof value === "string") {
			if (!fuseOptions.keys) {
				fuseOptions.keys = [];
			}

			fuseOptions.keys.push(value);
		}

		return this;
	}

	function distance(value) {
		if (typeof value === "number") {
			fuseOptions.distance = value;
		}

		return this;
	}

	function location(value) {
		if (typeof value === "number") {
			fuseOptions.location = value;
		}

		return this;
	}

	function maxPatternLength(value) {
		if (typeof value === "number") {
			fuseOptions.maxPatternLength = value;
		}

		return this;
	}

	function minMatchCharLength(value) {
		if (typeof value === "number") {
			fuseOptions.minMatchCharLength = value;
		}

		return this;
	}

	function shouldSort(value) {
		if (typeof value === "boolean") {
			fuseOptions.shouldSort = value;
		}

		return this;
	}

	function threshold(value) {
		if (typeof value === "number") {
			fuseOptions.threshold = value;
		}

		return this;
	}

	function build() {
		return fuseOptions;
	}
}
