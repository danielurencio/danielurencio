var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    gd = require('./gd/testgd.js');

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



app.get('/01', function(req,res) {
    res.render("01")
});

app.get('/02', function(req,res) {
    res.render("02")
});

app.get('/03', function(req,res) {
    res.render("03")
});

app.get('/04', function(req,res) {
    res.render("04")
});

app.get('/05', function(req,res) {
    res.render("05")
});

app.get('/06', function(req,res) {
    res.render("06")
});

app.get('/07', function(req,res) {
    res.render("07")
});

app.get('/08', function(req,res) {
    res.render("08")
});

app.get('/09', function(req,res) {
    res.render("09")
});

app.get('/10', function(req,res) {
    res.render("10")
});

app.get('/11', function(req,res) {
    res.render("11")
});

app.get('/12', function(req,res) {
    res.render("12")
});

app.get('/13', function(req,res) {
    res.render("13")
});

app.get('/14', function(req,res) {
    res.render("14")
});

app.get('/15', function(req,res) {
    res.render("15")
});

app.get('/16', function(req,res) {
    res.render("16")
});

app.get('/ts', function(req,res) {
    res.render("ts");
});

