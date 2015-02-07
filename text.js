var arrivedAt = ["You've arrived at ","You're at ","Welcome to "];
var clues = [];
var firstClue = "Yo.";
clues[0] = "This story begins at a creepy location. Something scary happened. Will you go to $goto1 or $goto2?";
clues[1] = "Looking around carefully, you $notice. Approaching closer, you find a handwritten note, recently dropped on the ground. As you reach to pick it up, $ominous. The note is written in $handwriting that seems somehow familiar. \"I'll meet you at $goto1,\" the note reads. \"Just stay away from $goto2.\"";
clues[2] = "A $person approaches you. \"I knew I'd find you here,\" he says, looking around cautiously. Come this way.";
clues[3] = clues[1];
clues[4] = clues[1];
clues[5] = clues[1];
clues[6] = "";
clues[7] = "";
clues[8] = "";
clues[9] = "";

var ominous = ["a chill goes down your back","you feel a sense of foreboding","a black cat walks up to you","a cold wind blows","you hear a soft whisper in the distance","a raven crows in the distance","a shooting star whizzes through the sky"];

var noticable = ["detect a faint smell, almost like the scent of fresh-baked cookies","notice a strong odor, like a refrigerator that needs cleaning","spot a small signature graffitied onto the wall","see a pair of initials carved into the wall","see a  footprint on the ground","notice a footprint in the mud","see a fingerprint on the doorhandle","notice a fingerprint on the wall"];

var handwriting = ["beautiful cursive handwriting","sloppy cursive handwriting","beautiful calligraphy","sloppy block lettering","cramped handwriting","tiny, neat handwriting","neat handwriting","neat, systematic handwriting"];

var person = ["scruffy, unattractive man","fair-skinned, narrow-faced man","short, thin man","young, fair-skinned man", "short, scruffy man","pale man with hazel eyes","pale man with long,braided dark brown hair","short man with a wide face and bushy eyebrows","tall man with a hooked nose and a double chin","scruffy man dressed in black robes","overweight man with short hair","bald man wearing a gold ring","skinny man with bushy eyebrows","olive-skinned man wearing dark-colored clothes","tall man with bad breath and greasy brown hair"];


function pickRandom(arr)
{
	return arr[Math.floor(Math.random()*arr.length)];
}
function substituteRandom(str)
{
	return str.replace("$notice",pickRandom(noticable)).replace("$ominous",pickRandom(ominous)).replace("$handwriting",pickRandom(handwriting)).replace("$person",pickRandom(person));
}

exports.onNewLandmark = function (json, a_or_b, landmark, cals, goto1, goto2) {
	var chosenClues = json.chosenClues;
	var response="";
	var clue="";
	if(landmark!==null)
	{
		chosenClues[json.clueCount] = a_or_b;
		json.clueCount++;
		response += pickRandom(arrivedAt) + landmark;
		response += ". ";
		clue = clues[json.clueCount+chosenClues[json.clueCount]]; //the relevant clue
	}
	else
	{
		clue=firstClue;
	}
	response += substituteRandom(clue).replace("$landmark",landmark).replace("$cals",cals).replace("$goto1",goto1).replace("$goto2",goto2);

	//response += "Now go to " + goto1 + " to find out what happens to" + x;
	//response += " or go to " + goto2 + " to find out what happens to" + y;
	//response += "If you had gone to " + goto1 + "you would've discovered that " + CLUE;
	return response;
    //if final text
}

