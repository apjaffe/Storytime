var arrivedAt = ["You've arrived at ","You're at ","Welcome to "];
var clues = [];
clues[0] = "This story begins at a creepy location. Something scary happened. Will you go to $goto1 or $goto2?";
clues[1] = "Now that you're at $landmark, you notice that you've burned $cals calories. You can go to $goto1 or $goto2.";
clues[2] = clues[1];
clues[3] = clues[1];
clues[4] = clues[1];
clues[5] = clues[1];
clues[6] = "";
clues[7] = "";
clues[8] = "";
clues[9] = "";



exports.onNewLandmark = function (json, a_or_b, landmark, cals, goto1, goto2) {
	var clueCount = json.clueCount;
	var chosenClues = json.chosenClues;
	chosenClues[clueCount] = a_or_b;
	var response="";
	response += arrivedAt[Math.floor(Math.random()*arrivedAt.length)] + landmark;
	response += ". ";
	clue = clues[clueCount+chosenClues[clueCount]]; //the relevant clue
	response += clue.replace("$landmark",landmark).replace("$cals",cals).replace("$goto1",goto1).replace("$goto2",goto2);
	//response += "Now go to " + goto1 + " to find out what happens to" + x;
	//response += " or go to " + goto2 + " to find out what happens to" + y;
	//response += "If you had gone to " + goto1 + "you would've discovered that " + CLUE;
	return response;
    //if final text
}

