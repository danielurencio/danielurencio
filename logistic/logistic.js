var fs = require("fs");
var d3 = require("d3");
var sylvester = require("sylvester");

var input = process.argv[2];
var file = fs.readFileSync("./data.csv" ,"utf8");

function ML(data) {
  this.data = data;
};


ML.prototype.parse = function() {
  var input = this.data;
  var data = d3.csv.parse(input);

  data.forEach(function(doc) {
    for(var i in doc) {
      doc[i] = +doc[i];
    }
  });

  this.data = data;
//  return data;

};

ML.prototype.process = function(dependent) {
  var data = this.data;

  matrix = [];

  data.forEach(function(doc) {
    var a = [];

    for( var i in doc ) {
      if( i !== dependent ) {
        a.push(doc[i]);
      }
    }

    matrix.push(a);

  });

  var y = data.map(function(d) { return [d[dependent]]; });

  var M = $M(matrix);
  var y = $M(y);

  var obj = { x: M, y: y };

  return obj;

};

module.exports = { ML:ML, file:file };
