var arrivedAt = ["You've arrived at ","You're at","Welcome to"];
var clues = []
clues[0] = "$";
clues[1] = "";
clues[2] = "";
clues[3] = "";
clues[4] = "";
clues[5] = "";
clues[6] = "";
clues[7] = "";
clues[8] = "";
clues[9] = "";


var chosenClues = [false,false,false,false,false];
clueCount = 0;

exports.onNewLandmark = function (a_or_b, landmark, cals, goto1, goto2) {
	chosenClues[clueCount] = a_or_b;
	var response="";
	response += arrivedAt[Math.floor(Math.random()*arrivedAt.length)] + landmark;
	clue = clues[clueCount+chosenClues[clueCount]]; //the relevant clue
	console.log(clue,clueCount,chosenClues);
	response += clue.replace("$landmark",landmark).replace("$cals",cals).replace("$goto1",goto1).replace("$goto2",goto2);
	//response += "Now go to " + goto1 + " to find out what happens to" + x;
	//response += " or go to " + goto2 + " to find out what happens to" + y;
	//response += "If you had gone to " + goto1 + "you would've discovered that " + CLUE;
	return response;
    //if final text
}

