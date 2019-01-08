export function RandomizerFactory() {
	const factory = {
		randomize,
	};

	return factory;

	function randomize(length = 2, ucaseOut = false, type = "alphanumeric") {
		const ucaseValues = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const lcaseValues = "abcdefghijklmnopqrstuvwxyz";
		const ucaseHexValue = "ABCDE";
		const lcaseHexValue = "abcde";
		const numericValues = "0123456789";
		let text = "";
		let possibleValues = "";

		possibleValues += numericValues;

		if (ucaseOut) {
			possibleValues += ucaseValues;
		} else {
			possibleValues += ucaseValues;
			possibleValues += lcaseValues;
		}

		if (type.toLowerCase() === "hex") {
			possibleValues = "";
			possibleValues += numericValues;

			if (ucaseOut) {
				possibleValues += ucaseHexValue;
			} else {
				possibleValues += ucaseHexValue;
				possibleValues += lcaseHexValue;
			}
		}

		for (let i = 0; i < length; i++) {
			text += possibleValues.charAt(Math.random() * possibleValues.length);
		}

		return text;
	}
}
