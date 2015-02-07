var express = require('express')
var story = require('./text')
var app = express();

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

function toBoolean(str)
{
	return str==='true';
}


app.get('/story', function(req, res) {
	var a_or_b = toBoolean(req.query.a_or_b);
	var landmark = req.query.landmark;
	var cals = req.query.cals;
	var goto1 = "Entropy";
	var goto2 = "Walmart";
	var text = story.onNewLandmark(a_or_b,landmark,cals,goto1,goto2);
	res.send(text);
})

app.listen(app.get('port'), function() {
	  console.log("Node app is running at localhost:" + app.get('port'))
})
