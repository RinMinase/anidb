export function RandomizerFactory() {
	const factory = {
		randomize,
	};

	return factory;

	function randomize(length = 2, ucaseOut = false, ucase = true, lcase = true, numeric = true) {
		let text = "";
		const ucaseValues = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const lcaseValues = "abcdefghijklmnopqrstuvwxyz";
		const numericValues = "0123456789";
		let possibleValues = "";

		if (ucase) {
			possibleValues += ucaseValues;
		}

		if (lcase) {
			possibleValues += lcaseValues;
		}

		if (numeric) {
			possibleValues += numericValues;
		}

		for (let i = 0; i < length; i++) {
			text += possibleValues.charAt(Math.random() * possibleValues.length);
		}

		return (ucaseOut) ? text.toUpperCase() : text;
	}
}
