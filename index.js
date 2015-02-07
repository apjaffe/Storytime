//var fs = require('fs');
//var https = require('https');
var http = require('http');
var express = require('express');
var request = require('request');
var story = require('./text');
var srequest = require('sync-request');
var app = express();

var port = process.env.PORT || 8080;

//var privateKey = fs.readFileSync('server.key','utf8');
//var certificate = fs.readFileSync('server.crt','utf8');

//var credentials = {key: privateKey, cert: certificate};
var DEFAULT_DIST=200;
var initJSON={"chosenClues":[false,false,false,false,false],"clueCount":0,"exclude":{},"distance":DEFAULT_DIST};
var mapUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyCbFrbx4bfxB51Q8qO7sMbTtVQitGDQM8A&location=$lat%2C$lng&radius=$distance"
//&rankby=distance&types=$types";
var types="establishment|museum|park|library|restaurant|food";
var cityUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=$lat%2C$lng&key=AIzaSyCbFrbx4bfxB51Q8qO7sMbTtVQitGDQM8A&result_type=locality";

var clientId="QGJOGGvh8Ag";
var appSecret="0fb1df41c2fd3ef281b86370ca8d4369b9d5ea71";
var authUrl="https://jawbone.com/auth/oauth2/token?grant_type=authorization_code&client_id="+clientId+"&client_secret="+appSecret+"&code=$code";
var jawboneUrl="https://jawbone.com/nudge/api/v.1.1/users/@me/moves?start_time=$start";
var jawboneGoalUrl="https://jawbone.com/nudge/api/v1.1/user/@me/goals";

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
function getCity(lat,lng)
{
	var url = cityUrl.replace("$lng",lng).replace("$lat",lat);
	var res = srequest('GET',url);
	var body = JSON.parse(res.getBody().toString());
	if(body.results.length>0)
	{
		return body.results[0].address_components[0].long_name;
	}
	else
	{
		console.log(res.getBody().toString());
		return "a city";
	}
}

function getDistance(token)
{
	if(!token)
	{
		return DEFAULT_DIST;
	}
	var url = jawboneGoalUrl;
	var options =
	{
		"headers":{'Authorization: Bearer':token}
	};
	var res = srequest('GET',url,options);
	var body = JSON.parse(res.getBody().toString());
	if(body)
	{
		var steps = body.data.remaining_for_day.move_steps_remaining;
		return Math.max(steps/5,DEFAULT_DIST);
	}
	else
	{
		return DEFAULT_DIST;
	}
}

function cleanUrl(url)
{
	return url.replace(/&/g," and ");
}

//callback(cals,...)
function getUpData(token,startTime,callback)
{
	var url = jawboneUrl.replace("$start$",startTime);
	var options = {
		url: url,
		headers: {'Authorization: Bearer':token}
	};
	request(options,function(error,response,body)
	{
		if(!error && response.statusCode==200)
		{
			var results = JSON.parse(body).data;
			var details = results.items[0].details;
			callback(details.calories);
		}
	});
}



//callback(goto1,goto2);
function getLandmarkChoices(lat,lng,distance,exclude,callback)
{
	var url = mapUrl.replace("$lng",lng).replace("$lat",lat).replace("$types",types).replace("$distance",distance);
	request.get(url,function(error, response, body)
	{
		if(!error && response.statusCode == 200)
		{
			var results = JSON.parse(body).results;
			var num1=-1;
			var num2=-1;
			if(results.length>=2)
			{
				for(var i=0;i<1000;i++)
				{
					num1 = Math.floor(Math.random()*(results.length));
					if(!exclude[results[num1].name])
						break;
					else
						num1=-1;
				}
				for(var i=0;i<1000;i++)
				{
					num2 = Math.floor(Math.random()*(results.length));
					if(!exclude[results[num2].name] && num2!=num1)
						break;
					else
						num2=-1;
				}
			}
			//console.log(results[num1].name);
			//console.log(results[num2].name);
			//console.log(exclude[results[num1.name]]);
			//console.log(exclude);
			if(num1!=-1 && num2!=-1)
			{
				results[num1].name=cleanUrl(results[num1].name);
				results[num2].name=cleanUrl(results[num2].name);
				callback(results[num1],results[num2]);
			}
			else
			{
				console.log(url);
				console.log(body);
				callback(null);
			}
		}
	});
}

app.get('/auth', function(req, res)
{
	var url = authUrl.replace("$code",req.query.token);
	console.log(url);
	request.get(url,function(error, response, body)
	{
		if(!error && response.statusCode == 200)
		{
			res.send(body);
		}
		else
		{
			res.send("Invalid token");
			console.log(body);
		}
	});
});

app.get('/story', function(req, res)
{
	var jsonstr = req.query.json;
	if(jsonstr===undefined || jsonstr===null)
	{
		json = JSON.parse(JSON.stringify(initJSON));
		json.city = getCity(req.query.lat,req.query.lng);
		json.distance = getDistance(req.query.token);
	}
	else
	{
		try
		{
			json = JSON.parse(jsonstr);
		}
		catch(e)
		{
			console.log(e);
			console.log(jsonstr);
			return;
		}
	}
	var a_or_b = false;;
	var landmark = null;
	if(req.query.a_or_b)
	{
		a_or_b = toBoolean(req.query.a_or_b);
		landmark = a_or_b?json.goto[0].name:json.goto[1].name;
		json.exclude[landmark]=true;
	}
	getLandmarkChoices(req.query.lat,req.query.lng,json.distance,json.exclude,function(goto1,goto2)
	{
		var callback = function(cals)
		{
			var text="";
			if(goto1===null)
			{
				text=("You live in a boring place. Sorry.");
			}
			else
			{
				text = story.onNewLandmark(json,a_or_b,landmark,cals,goto1.name,goto2.name,json.city);
				json.goto = [cleanLatLng(goto1),cleanLatLng(goto2)];
			}
			var obj={};
			obj.json=json;
			obj.text=text;
			res.send(JSON.stringify(obj));
		};
		if(req.query.token)
		{
			getUpData(req.query.token,req.query.startTime);
		}
		else
		{
			callback(0);
		}
	});
})
var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials,app);
httpServer.listen(port);
console.log("Node app is running");
//httpsServer.listen(443);
//app.listen(app.get('port'), function() {
//	  console.log("Node app is running at localhost:" + app.get('port'))
//})
