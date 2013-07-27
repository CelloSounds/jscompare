/*Global abatement */
var jscompare = jscompare || {};
jscompare.contentPrefs = jscompare.contentPrefs || {};
jscompare.utils = jscompare.utils || {};

/*Create instance for Levenshtein scoring */
jscompare.contentPrefs.scoreObject = new diff_match_patch();

/* Score weighting for individual word matches */
jscompare.contentPrefs.compareWordsConf = {
	weighting : 10,
	rejectThreshold : 5
}

/* ************* */
/* MAIN FUNCTION */
/* ************* */

jscompare.contentPrefs.analyseContent = function analyseContent(primaryString, secondaryString) {

	/* Attributes */
	this.primaryWordList = primaryString.split(' ');
	this.secondaryWordList = secondaryString.split(' ');
	this.primaryPhrasePermutations = {}
	this.secondaryPhrasePermutations = {}
	jscompare.contentPrefs.matchScore = null;
	jscompare.contentPrefs.matchesList = {}

	/* Methods */
	
	/* Natural logarithm - function obtained from internet but unable to relocate source */
	this.ln = function ln(val) {
		return Math.log(val) / Math.LOG10E;
	}

	this.getScore = function getScore(primarySubstring, secondarySubstring) {
		/*Return Levenshtein score */
		return jscompare.contentPrefs.scoreObject.diff_levenshtein(jscompare.contentPrefs.scoreObject.diff_main(primarySubstring, secondarySubstring));
	}
	/* Return comparative scores on individual word or phrase combinations */
	this.compareSubtext = function compareSubtext(primaryArray, secondaryArray) {
		/* for each primary text related word */
		primaryArray.forEach(function(primaryItem) {
			/* compare that word with each secondary related word in turn and get a match scoring */
			secondaryArray.forEach(function(secondaryItem) {
				jscompare.contentPrefs.matchScore = that.getScore(primaryItem, secondaryItem);
				/* check if the levenshtein score is low enough to meet the threshold for a useful match */
				if (jscompare.contentPrefs.matchScore <= jscompare.contentPrefs.compareWordsConf.rejectThreshold) {
					/* determine if match is new or scores less than an existing match */
					if (jscompare.contentPrefs.matchesList[primaryItem] === undefined || (25 / that.ln(jscompare.contentPrefs.matchScore + 2)) * (that.ln(primaryItem.length)) > jscompare.contentPrefs.matchesList[primaryItem]) {
						jscompare.contentPrefs.matchesList[primaryItem] = (25 / that.ln(jscompare.contentPrefs.matchScore + 2)) * (that.ln(primaryItem.length));
					}
				}
			})
		})
	}

	var that = this;

	/* Call driver program to return comparative scores */
	this.compareSubtext(this.primaryWordList, this.secondaryWordList);
	
	return jscompare.contentPrefs.matchesList;
}

/* Calculate the total of all the match scores as a final match total */
jscompare.contentPrefs.CalculateCumulativeMatchScore = function CalculateCumulativeMatchScore(matchesListObject) {
	this.runningScore = 0;
	for (match in matchesListObject) {
		this.runningScore += matchesListObject[match];
	}
	return this.runningScore;
}


