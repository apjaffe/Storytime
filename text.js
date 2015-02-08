var arrivedAt = ["You've arrived at ","You're at ","Welcome to "];
var clues = [];

var firstClue = "The number of steps you want to accomplish today is $steps. Today we'll be following the story of Clayton Edmond, a $person from New England. He was a middle-aged and tired professor. Why is he in $city today? All we know is that his girlfriend wanted to meet him at $goto1, but his boss had a meeting scheduled with him at $goto2. Go to either to find a clue."
clues[0] = "Clayton's girlfriend, Mariah, was pacing back and forth when he got here 7 hours ago. \"Why in the world would you call Jason, she cried. He's already on his way. Get to either of the two safehouses that I set up for you: $goto1 or $goto2."
clues[1] = "Looking around carefully, he $notice. Approaching closer, he found a handwritten note, recently dropped on the ground. As he reached to pick it up, $ominous. The note is written in $handwriting that seems somehow familiar. \"I'll meet you at $goto1,\" the note reads. \"Just stay away from $goto2.\"";
clues[2] = "$landmark wasn’t at all what Clayton expected. Mariah lied to him! Jason was sitting on a bench right here when Jason walked in 4 hours ago, and $ominous. \”It’s over,\” he thought. \”I’m done for.\” Jason escorted Clayton to $goto1, and dropped something you can find. Then, he brought Clayton to $goto2, and also haphazardly dropped something. You can only go to one. Go!"
clues[3] = "So far you've burned $cals calories. Clayton looked around and saw a $person. Then he saw Mariah and his boss together, holding hands. He was fuming. \” We have to tell you something, \” they said in unison. $ominous. Then they immediately ran in different directions: one ran to $goto1, and one ran to $goto2."
clues[4] = "So far you've burned $cals calories. Clayton was out of breath when he caught up to Jason. He $notice. Jason started talking immediately: \“Your girlfriend is out of her mind. She took the AI you wrote, and gave it to Evil Mad Science Corporation! \” Jason was dumbfounded. \”She realized her mistake, but it’s almost too late.\” There are two agents from the dee oh dee here to assist you One’s at $goto1 and the other is at $goto2. Don’t trust them completely though.";
clues[5] = "Clayton was out of breath when he caught up to Jason. He $notice. Jason started talking immediately: \”I’m sorry I had to do this.” $ominous. \”I seduced Mariah to have an affair with me. I have your AI, and I gave it to the Iranians. They gave me a billion dollars. I couldn’t resist. \” A agent dressed in all black grabbed him by the arm and took him to $goto1. They stopped at $goto2 along the way.";
clues[6] = "The agent was a $person. \”Don’t worry, I’m here to help. My undercover team and I discovered that your AI, even though it can understand and manipulate human emotions, has a weakness for $weaknesses1, which you can find at $goto1. You could also try to build an emergency shutdown switch and broadcast the override password. You'll find the password at $2.";
clues[7] = "The agent was a $person. \”You’re an imbecile for making that AI. Understanding and manipulating human emotions? That’s the most pathetic research project I’ve ever heard of.\” Clayton furtively glanced at a window out of the corner of his eye. Before he could think twice, he jumped out and made a run for it to either $goto1 or $goto2. Only you can find out, and you can change history depending on where you go.";
clues[8] = "Clayton found a weakness of his AI (obviously) and began shutting down his AI. The process was long and difficult, seemingly impossible. Finally, though, the secret weapon was prepared, and the AI was vanquished.";
clues[9] = "\"I knew you would come here eventually,\" the AI announced confidently. \"It was so easy to trick your friends into leading you here. Did you really think I wouldn't disable my emergency shutdown code?\" The agent tricked Jason and the AI manipulated his emotions so quickly that he fell into a coma. You see his body the second you get to $landmark.";

var ominous = ["a chill went down his back","he felt a sense of foreboding","a black cat walked up to him","a cold wind blew into his face","he heard a soft whisper in the distance","a raven crowed in the distance","he remembered when he broke his foot in third grade."];

var noticable = ["detected a faint smell, almost like the scent of fresh-baked cookies","noticed a strong odor, like a refrigerator that needs cleaning","spotted a small signature graffitied onto the wall","saw a pair of initials carved into the wall","saw a  footprint on the ground","noticed a footprint in the mud","saw a fingerprint on the doorhandle","noticed a fingerprint on the wall"];

var weaknesses = ["cupcakes","topology","two fifty one","water","social interaction","coffee","beautiful lilacs"]

var handwriting = ["beautiful cursive handwriting","sloppy cursive handwriting","beautiful calligraphy","sloppy block lettering","cramped handwriting","tiny, neat handwriting","neat handwriting","neat, systematic handwriting"];

var person = ["scruffy, unattractive man","fair-skinned, narrow-faced man","short, thin man","young, fair-skinned man", "short, scruffy man","pale man with hazel eyes","pale man with long,braided dark brown hair","short man with a wide face and bushy eyebrows","tall man with a hooked nose and a double chin","scruffy man dressed in black robes","overweight man with short hair","bald man wearing a gold ring","skinny man with bushy eyebrows","olive-skinned man wearing dark-colored clothes","tall man with bad breath and greasy brown hair"];


function pickRandom(arr)
{
	return arr[Math.floor(Math.random()*arr.length)];
}
function substituteRandom(str)
{
	return str.replace("$notice",pickRandom(noticable)).replace("$ominous",pickRandom(ominous)).replace("$handwriting",pickRandom(handwriting)).replace("$person",pickRandom(person)).replace("$weaknesses1",pickRandom(weaknesses)).replace("weaknesses2",pickRandom(weaknesses));
}

exports.onNewLandmark = function (json, a_or_b, landmark, cals, goto1, goto2, city, steps) {
	var chosenClues = json.chosenClues;
	var response="";
	var clue="";
	if(json.clueCount==5)
	{
		clue="You already finished the story, what are you doing?";
	}
	else if(landmark!==null)
	{
		chosenClues[json.clueCount] = a_or_b;
		clue = clues[json.clueCount*2+chosenClues[json.clueCount]]; //the relevant clue
		json.clueCount++;
	}
	else
	{
		clue=firstClue;
	}
	response += substituteRandom(clue).replace("$landmark",landmark).replace("$cals",cals).replace("$goto1",goto1).replace("$goto2",goto2).replace("$city",city).replace("$cals",cals).replace("$steps",steps);

	return response;
}

