/*!
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ ROCOStringWithFormat

exports.ROCOStringWithFormat = function(inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('ROCOErrorInputInvalid');
	}

	var substitutions = Object.values(arguments).slice(1);

	if (!substitutions.length) {
		return inputData;
	}

	var formattedString = inputData;

	(inputData.match(/\%\@/g) || []).forEach(function(e, i) {
		formattedString = formattedString.replace(e, substitutions[i]);
	});

	exports._ROCOStringAllMatchesWithRegexAndString(/\%\$(\d*)\@/g, inputData).forEach(function(e) {
		formattedString = formattedString.replace(e[0], substitutions[e[1] - 1]);
	});

	return formattedString;
};

//_ _ROCOStringAllMatchesWithRegexAndString

exports._ROCOStringAllMatchesWithRegexAndString = function(regex, string) {
	var matches = [];

	var match = regex.exec(string);

	while (match != null) {
		matches.push(match);

		match = regex.exec(string);
	}

	return matches;
};
