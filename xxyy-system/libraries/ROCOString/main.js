/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

//_ ROCOStringWithFormat

exports.ROCOStringWithFormat = function (inputString, substitutions) {
	if (typeof inputString !== 'string') {
		throw new Error('ROCOErrorInputInvalid');
	}

	if (!Array.isArray(substitutions)) {
		throw new Error('ROCOErrorInputInvalid');
	}

	if (!substitutions.length) {
		return inputString;
	}

	var formattedString = inputString;

	(inputString.match(/\%\@/g) || []).forEach(function (e, i) {
		formattedString = formattedString.replace(e, substitutions[i]);
	});

	exports._ROCOStringAllMatchesWithRegexAndString(/\%\$(\d*)\@/g, inputString).forEach(function (e) {
		formattedString = formattedString.replace(e[0], substitutions[e[1] - 1]);
	});

	return formattedString;
};

//_ _ROCOStringAllMatchesWithRegexAndString

exports._ROCOStringAllMatchesWithRegexAndString = function (regex, string) {
	var matches = [];

	var match = regex.exec(string);
	
	while (match != null) {
		matches.push(match);

	  match = regex.exec(string);
	};

	return matches;
};
