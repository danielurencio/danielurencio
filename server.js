var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    read = require('./gd/read.js'),
    gd = require('./gd/gdCopia.js');

var database = "danielurencio";

app.engine('html', engines.nunjucks),
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

// default to a 'localhost' configuration:
var connection_string = 'localhost:27017/' + database;
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

MongoClient.connect('mongodb://' + connection_string, function(err, db) {

    var query = db.collection('site').find({ "_id": "main" }).project({"_id": 0});

    app.get('/', function(req,res) {

	query.forEach(function(doc) {
//	    console.log(doc);

	    for(var i in doc) { arr.push(doc[i]);}
	}, function(doc) {
	    res.render("index", { 'content': arr }); console.log(arr);
	});

	var arr = [];
    });


    app.use(function(req, res) {
        res.sendStatus(404);
    });


    var server = app.listen(server_port, server_ip_address, function() {
        console.log('danielurencio is on port ' + server_port + '!');
    });

});

app.get('/linear', function(req,res) {
    res.render("linearReg")
});

app.get('/ml', function(req,res) {
    res.json(gd.docs);
});
