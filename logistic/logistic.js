var fs = require("fs");
var d3 = require("d3");
var sylvester = require("sylvester");
var Matrix = sylvester.Matrix;
var underscore = require("underscore");

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
};

ML.prototype.process = function(dependent,normalization) {
  var data = this.data;
  var matrix = [];
  var keys = Object.keys(data[0]);
  var norm = {};

  if(normalization) {
    keys.forEach(function(k) {
      if( k!==dependent ) {
        norm[k] = {
	  mean: d3.mean( data.map(function(d) { return d[k]; }) ),
	  std: d3.deviation( data.map(function(d) { return d[k]; }) )
        };
      }
    });
  };

  data.forEach(function(doc) {
    if(normalization) {

      keys.forEach(function(k) {
        if( k !== dependent ) {
	  doc[k] = ( doc[k] - norm[k].mean ) / norm[k].std;
        };
      });

    };

    var a = [];

    for( var i in doc ) {
      if( i !== dependent ) {
        a.push(doc[i]);
      };
    };
    matrix.push(a);
  });

  var y = data.map(function(d) { return [d[dependent]]; });
  var X = $M(matrix);
  var m = X.dimensions().rows;
  var ones = Matrix.Ones(m,1);
  X = ones.augment(X);
  var n = X.dimensions().cols;
  var y = $M(y);
  var theta = Matrix.Zero(n,1);
  var obj = { x: X, y: y, theta: theta };

  this.data = obj;
};

function sigmoid(a) {
  var result = [a].map(function(d) { return 1 / ( 1 + Math.exp(-d) ) });
  return result[0];
};

function sigmoidM(a) {
  var data = a.elements;
  var result = data.map(function(d) { return [1 / ( 1 + Math.exp(-d[0]) )]; });
  var M = $M(result);
  return M;
};

ML.prototype.logisticCost = function() {
  var data = this.data;
  var y = data.y;
  var m = data.x.dimensions().rows;
  var z = data.x.x(data.theta);


  z.elements.forEach(function(z,i) {
    z[0] = -y.e(i,1) * Math.log( sigmoid(z[0]) )
           - ( 1 - y.e(i,1) ) * Math.log( 1 - sigmoid(z[0]) );
  });

  var J = (1/m) * d3.sum( underscore.flatten(z.elements) );

  return J; 
};

ML.prototype.logisticGD = function(alpha,iter) {
  var data = this.data;
  var x = data.x;
  var y = data.y;
  var theta = data.theta;
  var m = x.dimensions().rows;

  for(var i=0; i<iter; i++) {
    var z = x.x(theta);
/*
    z.elements.forEach(function(z) {
      z[0] = sigmoid(z[0]);
    });
*/

    var h = sigmoidM(z);
    var d = h.subtract(y);
    var oxd = x.transpose().x(d);
    var a = alpha/m;
    var t = oxd.x(a);

    theta = theta.subtract(t);
  }

  this.data.theta = theta;
};

module.exports = { ML:ML, file:file };
