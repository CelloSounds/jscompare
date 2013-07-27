WHAT THE CODE DOES

The code will compare two strings of either tags or free text (or a mixture) and output a score which is suggestive of the closeness of the match. Scores outputted from multiple comparison operations are relative and therefore the function can be used to determine a best match between multiple sources of free text by comparing the scores outputted. Higher scores represent a close match.

The following rules are applied

a. Longer word matches sore logarithmically higher than smaller matches
b. The greater the distance between two compare words, the smaller the score multiplier (and therefore the score will be)
c. Comparisons between words that are not close enough to meet the threshold score which determines a likely match are not scored

USING THE CODE
To use this code you will need to download the JS version of google's diff_match_patch library at

https://code.google.com/p/google-diff-match-patch/downloads/list

To create a working example in your browser add the following script tags to your HTML page

<script type='text/javascript' src='diff_match_patch.js'></script>
<script type='text/javascript' src='jscompare.js'></script>
<script>
/* Working example */
document.write(jscompare.contentPrefs.CalculateCumulativeMatchScore(jscompare.contentPrefs.analyseContent('My primary text', 'My secondary text')));
</script>


THINGS TO FIX
a. Some code is executed twice uneccessarily
b. Comments need to be improved
c. Method naming needs to be shortened
d. Fix public and private attributes


THINGS TO IMPROVE
a. Make algorithm a plug-in function rather than hard coded
b. Create plug-in option for semantic exceptions (for specific use cases)
c. Allow output of match scores without calculating total score to allow for intermediate processing of output
d. Add feature to allow adjacent word combinations to be compared
e. Add feature to enable JS string object to be extended along the lines of 'my string'.compare('another string');


