/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
    credits = require('./credits.js');

var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 8000);

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

    app.use(express.compress());
    app.use(express.static(__dirname + '/static'));
    app.use(express.errorHandler());
    app.use(express.basicAuth(credits.authenticate));
    app.use(app.router);
});


// index page
// show credits
app.get("/", function(req, res) {
    var data = credits.getCredits(function(data) {
        res.render('index', data);
    });
});


// refresh credits
app.get('/refresh', function(req, res) {
    credits.refreshCredits(function(data) {
        res.render('refresh', data);
    });
});


// start server
http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});
