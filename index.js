//var fs = require('fs');
//var https = require('https');
var http = require('http');
var express = require('express');
var request = require('request');
var story = require('./text');
var srequest = require('sync-request');
var app = express();

//var privateKey = fs.readFileSync('server.key','utf8');
//var certificate = fs.readFileSync('server.crt','utf8');

//var credentials = {key: privateKey, cert: certificate};

var initJSON={"chosenClues":[false,false,false,false,false],"clueCount":0,"exclude":{}};
var mapUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyCbFrbx4bfxB51Q8qO7sMbTtVQitGDQM8A&location=$lat%2C$lng&rankby=distance&types=$types";
var types="establishment|museum|park|library|restaurant|food";
var cityUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=$lat%2C$lng&key=AIzaSyCbFrbx4bfxB51Q8qO7sMbTtVQitGDQM8A&result_type=locality";

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

function cleanUrl(url)
{
	return url.replace(/&/g," and ");
}

//callback(goto1,goto2);
function getLandmarkChoices(lat,lng,exclude,callback)
{
	var url = mapUrl.replace("$lng",lng).replace("$lat",lat).replace("$types",types);;
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
				//console.log(body);
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
		json.city = getCity(req.query.lat,req.query.lng);
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
	getLandmarkChoices(req.query.lat,req.query.lng,json.exclude,function(goto1,goto2)
	{
		var text="";
		if(goto1===null)
		{
			text=("You live in a boring place. Sorry.");
		}
		else
		{
			var cals = 0;//req.query.cals;
			text = story.onNewLandmark(json,a_or_b,landmark,cals,goto1.name,goto2.name,json.city);
			json.goto = [cleanLatLng(goto1),cleanLatLng(goto2)];
		}
		var obj={};
		obj.json=json;
		obj.text=text;
		res.send(JSON.stringify(obj));
	});
})
var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials,app);
httpServer.listen(8080);
console.log("Node app is running");
//httpsServer.listen(443);
//app.listen(app.get('port'), function() {
//	  console.log("Node app is running at localhost:" + app.get('port'))
//})
