var express = require('express')
var request = require('request');
var story = require('./text')
var app = express();

var initJSON={"chosenClues":[false,false,false,false,false],"clueCount":0};
var mapUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyCbFrbx4bfxB51Q8qO7sMbTtVQitGDQM8A&location=$lat%2C$lng&radius=800&mode=walking";

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

function toBoolean(str)
{
	return str==='true';
}

function cleanLatLng(json)
{
	return {"name":json.name,"lat":json.geometry.location.lat,"lng":json.geometry.location.lng};
}

//callback(goto1,goto2);
function getLandmarkChoices(lat,lng,callback)
{
	var url = mapUrl.replace("$lng",lng).replace("$lat",lat);
	request.get(url,function(error, response, body)
	{
		if(!error && response.statusCode == 200)
		{
			var results = JSON.parse(body).results;
			if(results.length>=2)
			{
				var num = Math.floor(Math.random()*(results.length-1));
				callback(results[num],results[num+1]);
			}
			else
			{
				callback(null);
			}
		}
	});
}

app.get('/story', function(req, res)
{
	var jsonstr = req.query.json;
	if(jsonstr===undefined || jsonstr===null)
	{
		json = JSON.parse(JSON.stringify(initJSON));
	}
	else
	{
		json = JSON.parse(jsonstr);
	}
	getLandmarkChoices(req.query.lat,req.query.lng,function(goto1,goto2)
	{
		var text="";
		if(goto1===null)
		{
			text=("You live in a boring place. Sorry.");
		}
		else
		{
			var a_or_b = false;;
			var landmark = null;
			if(req.query.a_or_b)
			{
				a_or_b = toBoolean(req.query.a_or_b);
				landmark = a_or_b?json.goto[0].name:json.goto[1].name;
			}

			var cals = 0;//req.query.cals;
			text = story.onNewLandmark(json,a_or_b,landmark,cals,goto1.name,goto2.name);
			json.goto = [cleanLatLng(goto1),cleanLatLng(goto2)];
		}
		var obj={};
		obj.json=json;
		obj.text=text;
		res.send(JSON.stringify(obj));
	});
})

app.listen(app.get('port'), function() {
	  console.log("Node app is running at localhost:" + app.get('port'))
})
