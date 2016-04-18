var fs = require('fs');
var d3 = require('d3');
var sylvester = require('sylvester');
var under = require('underscore');

var Matrix = sylvester.Matrix;
var file = './a.csv';
var file1 = './gd/data.csv';



var data = fs.readFileSync(file1, 'utf8').toString();// Read de csv and save to var
var docs = d3.csv.parse(data);// parse csv into an array of objects.


docs.forEach(function(d) {// Parse each value into float.
    for(var k in d) {
	d[k] = +d[k];
    }
});


module.exports.docs = docs;// Export the array of objects for visualization.


var processData = function(array, dependant) {
    var y = array.map(function(d) { return d[dependant]; });

    array.forEach(function(d) {
	delete d[dependant];
    });

    var c = 0;
    var arr = [];

    for(var i in array[0]) {// Create an array of arrays for each key in the obj's.
        c++;
        for(var e=0; e<c; e++) {
            arr[e] = [];
        }
    }

    array.forEach(function(doc) {// Push each object key value into its array.
        var u = 0;

        for(var i in doc) {
            arr[u].push(doc[i]);
            u++;
        }
    })

arr.forEach(function(d) { // Feature normalization.
        var mean = d3.mean(d);
	var std = d3.deviation(d);

    for( var i in d ) {
	d[i] = ( d[i] - mean ) / std;
    }

});
///////////////
var x = Matrix.create(arr).transpose();
var m = x.dimensions().rows;
var ones = Matrix.Zero(m,1).add(1);
x = ones.augment(x);
var n = x.dimensions().cols;
var parameters = Matrix.Zero(n,1);

var obj = {};
obj["x"] = x;
obj["y"] = Matrix.create(y);
obj["parameters"] = parameters;
    
    return obj;
};
module.exports.process = processData;

//var o = processData(docs,"Sales");


    var iterations = 1500;
    var alpha = 0.01;

//    computeCost(o);
//    gradientDescent(x, y, theta, alpha, iterations);



var computeCost = function(obj) {
    var predictions = obj["x"].x(obj["parameters"]);
    var sqrErrors = predictions.subtract(obj["y"])
	.map(function(d) { return d*d });
    var m = obj["y"].dimensions().rows;
    var SSE = d3.sum( under.flatten( sqrErrors.elements ) );
    var J = 1/(2*m) * SSE;

    return J;
   
};

module.exports.cost = computeCost;



var gradientDescent = function(obj, conf) {
    var m = obj["y"].dimensions().rows;
    
    for(var i=0; i<conf["iter"]; i++) {
	var pred = obj["x"].x(obj["parameters"]);  // X * THETA
        var dif = pred.subtract(obj["y"]);	   // (X*THETA) - Y
        var oxd = obj["x"].transpose().x(dif);     // X' * ( (X*THETA) - Y )
	var a = conf["alpha"]/m;
	var t = oxd.x(a); // alpha/m * X' * ( (X*THETA) - Y )

        obj["parameters"] = obj["parameters"].subtract(t);
    }

    return obj["parameters"];
};

module.exports.gd = gradientDescent;
