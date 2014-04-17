/*
 * jscompare 1.04
 * Author: Graham Ellsmore (ellsmo.re)
 * Website: https://github.com/CelloSounds/jscompare
 * Date: 11-Jan-14
 */

/*Global abatement */
var jscompare = jscompare || {};

/*Create instance for Levenshtein scoring */
jscompare.scoreObject = new diff_match_patch();

/* Score weighting for individual word matches */
jscompare.compareWordsConf = {
	weighting : 10,
	rejectThreshold : 5
};

/* ************* */
/* MAIN FUNCTION */
/* ************* */

jscompare.analyseContent = function analyseContent(primaryString, secondaryString) {

	/* Attributes */
	var primaryWordList = primaryString.split(' ');
	secondaryWordList = secondaryString.split(' ');
	primaryPhrasePermutations = {};
	secondaryPhrasePermutations = {};
	jscompare.matchScore = null;
	jscompare.matchesList = {};

	/* Methods */

	/* Natural logarithm - from web */
	var ln = function ln(val) {
		return Math.log(val) / Math.LOG10E;
	};

	/* Function to request a levenshtein score for a word or phrase comparison 
	 This is called multiple times untile all combinations between the 2 texts being compared are exhausted */ 
	var getScore = function getScore(primarySubstring, secondarySubstring) {
		/* Return Levenshtein score */
		return jscompare.scoreObject.diff_levenshtein(jscompare.scoreObject.diff_main(primarySubstring, secondarySubstring));
	};
	
	/* Iterate through each combination of individual words from both texts and request a match score if levenshtein score is within threshold */
	var compareSubtext = function compareSubtext(primaryArray, secondaryArray) {
		var scoreValue;
		/* for each primary text related word */
		primaryArray.forEach(function(primaryItem) {
			/* compare that word with each secondary related word in turn and get a match scoring */
			secondaryArray.forEach(function(secondaryItem) {
				jscompare.matchScore = getScore(primaryItem, secondaryItem);
				/* check if the levenshtein score is low enough to meet the threshold for a useful match */
				if (jscompare.matchScore <= jscompare.compareWordsConf.rejectThreshold) {
					/* Calculate match score value */
					scoreValue = (25 / ln(jscompare.matchScore + 2)) * (ln(primaryItem.length));
					/* determine if match is new or scores less than an existing match */
					if (jscompare.matchesList[primaryItem] === undefined || scoreValue > jscompare.matchesList[primaryItem]) {
						jscompare.matchesList[primaryItem] = scoreValue;
					}
				}
			});
		});
	};

	/* Call primary function to return comparative scores */
	compareSubtext(primaryWordList, secondaryWordList);

	return jscompare.matchesList;
};
/* Calculate the total of all the match scores as a final match total */
jscompare.CalculateCumulativeMatchScore = function(matchesListObject) {
	var runningScore = 0;
	for (match in matchesListObject) {
		runningScore += matchesListObject[match];
	}
	return runningScore;
};
