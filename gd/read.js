var fs = require("fs");
var d3 = require("d3");

var data = fs.readFileSync("./gd/data.csv", "utf8").toString();

var docs = d3.csv.parse(data);
docs.forEach(function(d) {
    d.x = +d.x;
    d.y = +d.y;
});

exports.docs = docs;
//console.log(docs);
