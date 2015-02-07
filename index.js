var express = require('express')
var story = requires('./text')
var app = express();

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

app.get('/story', function(req, res) {
	var landmark = req.query.landmark;
	var cals = req.query.cals;
	var goto1 = "Entropy";
	var goto2 = "Walmart";
	var text = story.onNewLandmark(landmark,cals,goto1,goto2);
	res.send(text);
})

app.listen(app.get('port'), function() {
	  console.log("Node app is running at localhost:" + app.get('port'))
})
