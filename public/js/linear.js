var headerHeight = parseInt(d3.select("div.header").style("height"));
var htmlHeight = parseInt(d3.select("html").style("height"));
var remainingHeight = htmlHeight - headerHeight - 7;
var input = "/ml";

var svg = d3.select("div.content").append("svg")
    .attr({
	"padding": "0",
	"margin": "0",
	"width": "100%",
	"height": function() { return (remainingHeight); },
    });

d3.json(input, function(err, json) {
//    if error return console.warn(error);
    var width = d3.select("svg").style("width"); console.log(width);
    var data = json;
    var padding = 50;
    var xMax = d3.max(data, function(d) { return d.x; });
    var yMax = d3.max(data, function(d) { return d.y; });
//    var domainMax = Math.max(xMax, yMax);
    var factor = 2.5;
    var rangeMax = parseFloat(width)/factor;
    
console.log(data)
    var xScale = d3.scale.linear()
		.domain([ 0, xMax ])
		.range([ padding, rangeMax ]);

    var yScale = d3.scale.linear()
		.domain([ 0, yMax ])
		.range([ rangeMax, padding ]);

    svg.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr({
	  "cx": function(d) { return xScale(d.x); },
	  "cy": function(d) { return yScale(d.y); },
	  "r": "5",
	  "fill": "rgba(255,17,0,0.6)",
	  "stroke": "rgba(0,0,0,0.2)",
	  "stroke-width": "1.5"
	});

    var xAxis = d3.svg.axis().scale(xScale).ticks(10);

    svg.append("g")
	.attr({
	    "class": "axis",
	    "transform": "translate(0," + rangeMax + ")",
	}).call(xAxis);

    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);

    svg.append("g")
	.attr({
	    "class": "axis",
	    "transform": "translate(" + padding + ",0)"
	}).call(yAxis);


    svg.append("line")
	.style({
	    "stroke": "black",
	    "stroke-width": "1.5"
	})
	.attr({
	    "x1": function() { return xScale(0); },
	    "y1": function() { return yScale(4.1967); },
	    "x2": function() { return xScale(24); },
	    "y2": function() { return yScale(4.1967 + 1.4559*24); }
	});
});
