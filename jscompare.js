/*
 * jscompare 1.03
 * Author: Graham Ellsmore (ellsmo.re)
 * Website: https://github.com/CelloSounds/jscompare
 * Date: 16-Nov-13
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
	this.primaryWordList = primaryString.split(' ');
	this.secondaryWordList = secondaryString.split(' ');
	this.primaryPhrasePermutations = {};
	this.secondaryPhrasePermutations = {};
	jscompare.matchScore = null;
	jscompare.matchesList = {};

	/* Methods */

	/* Natural logarithm - function obtained from internet but unable to relocate source */
	this.ln = function ln(val) {
		return Math.log(val) / Math.LOG10E;
	};

	this.getScore = function getScore(primarySubstring, secondarySubstring) {
		/* Return Levenshtein score */
		return jscompare.scoreObject.diff_levenshtein(jscompare.scoreObject.diff_main(primarySubstring, secondarySubstring));
	};
	/* Return comparative scores on individual word or phrase combinations */
	this.compareSubtext = function compareSubtext(primaryArray, secondaryArray) {
		var scoreValue;
		/* for each primary text related word */
		primaryArray.forEach(function(primaryItem) {
			/* compare that word with each secondary related word in turn and get a match scoring */
			secondaryArray.forEach(function(secondaryItem) {
				jscompare.matchScore = that.getScore(primaryItem, secondaryItem);
				/* check if the levenshtein score is low enough to meet the threshold for a useful match */
				if (jscompare.matchScore <= jscompare.compareWordsConf.rejectThreshold) {
					/* Calculate match score value */
					scoreValue = (25 / that.ln(jscompare.matchScore + 2)) * (that.ln(primaryItem.length));
					/* determine if match is new or scores less than an existing match */
					if (jscompare.matchesList[primaryItem] === undefined || scoreValue > jscompare.matchesList[primaryItem]) {
						jscompare.matchesList[primaryItem] = scoreValue;
					}
				}
			});
		});
	};
	var that = this;

	/* Call driver program to return comparative scores */
	this.compareSubtext(this.primaryWordList, this.secondaryWordList);

	return jscompare.matchesList;
};
/* Calculate the total of all the match scores as a final match total */
jscompare.CalculateCumulativeMatchScore = function CalculateCumulativeMatchScore(matchesListObject) {
	this.runningScore = 0;
	for (match in matchesListObject) {
		this.runningScore += matchesListObject[match];
	}
	return this.runningScore;
};

