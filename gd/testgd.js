var fs = require('fs');
var d3 = require('d3');
var sylvester = require('sylvester');
var _ = require('underscore');

var Matrix = sylvester.Matrix;
var file = './data.csv';
var file1 = './gd/data.csv';



var data = fs.readFileSync(file, 'utf8').toString();
var docs = d3.csv.parse(data);


docs.forEach(function(d) {
    for(var k in d) {
	d[k] = +d[k];
    }
});


exports.docs = docs;


function processData(array) {
    var c = 0;
    var arr = [];

    for(var i in array[0]) {
        c++;
        for(var e=0; e<c; e++) {
            arr[e] = [];
        }
    }

    array.forEach(function(doc) {
        var u = 0;

        for(var i in doc) {
            arr[u].push(doc[i]);
            u++;
        }
    })

    var k = Object.keys(array[0]);
    var obj = {}; var b = 0;
    k.forEach(function(d) {
	obj[d] = Matrix.create(arr[b]);
	b++;
    });
    return obj;
};

var D = processData(docs);


    var x = D.x;  //Matrix.create(D.x);
    var y = D.y;  //Matrix.create(D.y);
    var m = y.dimensions().rows;
    var ones = Matrix.Zero(m,1).add(1); x = ones.augment(x);
    var n = x.dimensions().cols;
    var theta = Matrix.Zero(n,1);
    var iterations = 1500;
    var alpha = 0.01;

    computeCost(x, y, theta);
    gradientDescent(x, y, theta, alpha, iterations);



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
