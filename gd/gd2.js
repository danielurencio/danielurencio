var fs = require('fs');
var d3 = require('d3');
var sylvester = require('sylvester');
var _ = require('underscore');

var Matrix = sylvester.Matrix;
//var X = [], Y = [];
var file = './data.csv';



fs.readFile(file, 'utf8', function read(err, data) {
    var docs = d3.csv.parse(data);
    var X = [], Y = [];

    docs.forEach(function(d) {
	X.push(parseFloat(d.x));
	Y.push(parseFloat(d.y));
    });

    var x = Matrix.create(X);
    var y = Matrix.create(Y);
    var m = y.dimensions().rows;
    var ones = Matrix.Zero(m,1).add(1); x = ones.augment(x);
    var n = x.dimensions().cols;
    var theta = Matrix.Zero(n,1);
    var iterations = 1500;
    var alpha = 0.01;

    computeCost(x, y, theta);
    gradientDescent(x, y, theta, alpha, iterations);

});


function computeCost(X, Y, THETA) {
    var predictions = X.x(THETA);
    var sqrErrors = predictions.subtract(Y).map(function(d) { return d*d });
    var m = Y.dimensions().rows;
    var SSE = d3.sum( _.flatten( sqrErrors.elements ) );
    var J = 1/(2*m) * SSE;
    console.log(J);
};

function gradientDescent(X, Y, THETA, ALPHA, ITERATIONS) {
    var m = Y.dimensions().rows;
    var n = THETA.dimensions().rows;
    var prediction;

    for(var i=0; i<ITERATIONS; i++) {
	prediction = X.x(THETA);
	var PminusY = prediction.subtract(Y).transpose();

    var th = [];

	for(var u=1; u<=n; u++) {
	  var PminusY_x_X = PminusY.x( X.col(u).transpose() );
	  var temp = THETA.e(u,1) - (ALPHA/m) * PminusY_x_X.e(1,1);
	  th.push([temp]);
	}

    THETA = $M(th);
    }

   console.log(THETA);
};
