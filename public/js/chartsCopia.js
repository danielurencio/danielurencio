var ts = function(da, selection, config) {
  var date = d3.time.format(config.dateformat);

  for(var i in da) {
    da[i].year = date.parse(da[i].year);
  }

  var c, multi;
  if(config) { c = config; }

  if( Object.keys(da[0]).length == 2 ) {
		var x = Object.keys(da[0])[0];
		var y = Object.keys(da[0])[1];

		var data = da.map(function(d) {
			return [d[x], d[y]];
		});
	
		var line = d3.svg.line()
                    .interpolate("basis")
	    	    .x(function(d) { return x(d[0]); })
		    .y(function(d) { return y(d[1]); });

    multi = false;

  }

  else if (Object.keys(da[0]).length == 3) {

	multi = true;
	var key = Object.keys(da[0])[0];

	var line = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return x( d["year"] ); })
	    .y(function(d) { return y( d["value"] ); });


  }
data = da;


	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("right");



if(!multi) {
	x.domain(d3.extent(data, function(d) { return d[0]; }));
	y.domain(d3.extent(data, function(d) { return d[1]; }));
}
else {
        x.domain(d3.extent(data, function(d) { return d.year; }));
	y.domain([
	  d3.min(data, function(d) { return d.value; }),
	  d3.max(data, function(d) { return d.value; })
	]);

	data = d3.nest()
	    .key(function(d) {
		return d[key];
	    })
	    .entries(da);/**/ 
    
}




	function chart(data) {

		var svg = d3.select(selection)
		  //.append("div").attr({"class": "content"})
		    .append("svg").attr("class", "content1")
			.style({
			    "margin": "auto",
			    "display": "block",
			    "width": width,
			    "height": 500
			})
			.append("g")
			.attr({
			    "class": "graph",
			    "transform": "translate(0,20)"
			});

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "translate(10, -25)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.style("font-size", "12")
			.text(function() { return "Y"; });

svg.selectAll("y.axis").transition().call(yAxis);

	if(!multi) {
		svg.append("path")   //line generation
			.attr("class", "line")
         }
	 else {
		if(c) {	var colorStroke = c.stroke; }
		else { var colorStroke = "black"; }
		var m = [];
	        data.forEach(function(d) { 
		
		if(data.length>1) {  // If its multi-series configure color.
			var color = d3.scale.linear()
				.domain([d3.extent(m)[0], d3.extent(m)[1]])
				.range(["lightblue","red"]);

			  var vals = d.values.map(function(m) {
				return m.value 
			  } );
			  var mean = d3.mean(vals);
			  m.push(mean);
			  var col = m[m.length-1];
			  colorStroke = color(col);
		}
		var lines = svg.selectAll(".line")
			.data(data).attr("class","line");
	
	//	lines.transition().attr("d",line(d.values))
	//	  .style("stroke", function(d) { return colorStroke });
	
		    svg.append("path")
			.attr("class", "line")
			.attr("d", line(d.values))
			.style("stroke", function(e) {
			    return colorStroke;
			} );

	//	lines.exit().remove()
		});
	 }

		d3.selectAll(".line").style({// 
		//	"stroke": function() { return c.stroke || "black"; },
			"stroke-width": function() { return c.Lwidth || "1"; },
			"fill": "none"
			});


		d3.selectAll(".x.axis path").style({ //
		    "display": function() { return c.xdisplay || "inline" }
		});

		d3.selectAll(".y.axis path").style({//
		    "display": function() { return c.ydisplay || "inline" }
		});

		d3.selectAll(".axis path,.axis line").attr({//
		    "fill": "none",
		    "stroke": function() { return c.ticks || "black" },
		    "shape-rendering": "crispEdges"
		});

		d3.selectAll(".graph").style({
		    "font-family": function() { return c.font || "helvetica" },
		    "fill": function() { return c.fill || "black" }
		});

		d3.selectAll(".tick").style({
		    "font-size": "8.5"
		});

		
	};


    return chart(data);
  

};

/////////////////////////
//////SCATTERPLOT
///////////////////////

var scatter = function(data, selection, config) {
  var x1 = Object.keys(data[0])[1];
  var x2 = Object.keys(data[0])[2];
  var c = config;
  var size = height + 80;

//	function chart(data) {

		var svg = d3.select(selection)
		 .append("div").attr({ "class": "content" })
		    .append("svg")
			.style({
			    "margin": "auto",
			    "display": "block",
			    "width": size + 100,
			    "height": size + 80
			})
			.append("g")
			.attr({
			    "class": "graph",
			    "transform": "translate(30,30)"
			});

if ( c.xlog ) {
	var x = d3.scale.log()
		.domain(d3.extent(data, function(d) { return d[x1]; }))
		.range([0, size]);
}
else {
	var x = d3.scale.linear()
		.domain(d3.extent(data, function(d) { return d[x1]; }))
		.range([0, size]);
}

	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d[x2]; })])
		.range([size, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("top");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("right");

	
        var col1 = "rgb(202,0,42)";
	var col2 = "rgb(255,161,53)";


	var colscale = d3.scale.log()
	    .domain(d3.extent(data, function(d) {return d[x2]}))
	    .range(["steelblue", "red"])

		svg.selectAll("circle")
		    .data(data)
		    .enter()
		    .append("circle")
		    .attr({
			"fill-opacity": "0.75",
			"cx": function(d) { return x(d[x1]); },
			"cy": function(d) { return y(d[x2]); },
			"r": "5",
			"fill": function(d) {

			    return colscale(d[x2]);
			}
		    })
		    .on("mouseover", function(d) {
			d3.select(this).attr({
			    "fill": "steelblue",
			    "fill-opacity": "1"
			});
			var x = d3.select(this).attr("cx");
			var y = d3.select(this).attr("cy");
			svg.append("text")
			    .attr({
				"fill-opacity": function() { return "1" },
				"x": function() { return Number(x) + 7; },
				"y": function() { return y; },
				"font-size": "14",
				"font-family": "helveticaneue"
			    })
			    .attr("class", "tip")
			    .text(function() { return d.country; });

			if(d.period) {

			svg.append("text")
			    .attr({
				"fill-opacity": "1",
				"x": function() { return Number(x) + 14; },
				"y": function() { return Number(y) + 12; },
				"font-size": "12",
				"font-family": "lane"
			    })
			    .attr("class", "tip")
			    .text(function() { return d.period; });
			    
			}
		    })
		    .on("mouseout", function() {
			d3.select(this).attr("fill", function(d) {
			    return colscale(d[x2]);
			})
			d3.selectAll(".tip").remove();
		    })


		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + 0 + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + size + ",0)")
			.call(yAxis)
			.append("text")
			.attr("transform", "translate(20, -25)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(function() { return "Y"; });

	

		d3.selectAll(".x.axis path").style({ //
		    "display": function() { return c.xdisplay || "inline" }
		});

		d3.selectAll(".y.axis path").style({//
		    "display": function() { return c.ydisplay || "inline" }
		});

		d3.selectAll(".axis path,.axis line").attr({//
		    "fill": "none",
		    "stroke": function() { return c.ticks || "black" },
		    "shape-rendering": "crispEdges"
		});

		d3.selectAll(".graph").style({
		    "font-family": function() { return c.font || "helvetica" },
		    "fill": function() { return c.fill || "black" }
		});

		d3.selectAll(".tick").style({
		    "font-size": "8.5"
		});

};


function enlist(data, selection, config) {

data.sort(
    function(a,b) {
	return d3.descending(a.mean, b.mean);
    }
);

  var svg = d3.select(selection)
    .append("div").attr({ "class": "content" })
    .append("svg")
    .style({
      "margin": "auto",
      "display": "block",
      "width": 900,
      "height": 600
    })
    .append("g")
    .attr({
      "class": "list",
      "transform": "translate(0,0)"
    });

    var colscale = d3.scale.linear()
	.domain(d3.extent(data, function(d) { return d.mean; } ))
	.range(["steelblue","red"]);

  var c_a = 54, c_b = 235;

  svg.selectAll("text").data(data).enter().append("text")
    .attr({
      "x": function(d,i) {  //return 5
	if (i+1 <= c_a) { return 0; }
	else if (i+1 > c_a && i+1 <= c_a*2) { return c_b; }
	else if (i+1 > c_a*2 && i+1 <= c_a*3) { return c_b*2; }
	else if (i+1 > c_a*3) { return c_b*3; }

      },
      "y": function(d,i) { //return 11*(i+1);
	if (i+1 <= c_a) {  return 11 * (i+1); }
	else if (i+1 > c_a && i+1 <= c_a*2) { return 11 * (i-c_a+1); }
	else if (i+1 > c_a*2 && i+1 <= c_a*3) { return 11 * (i-c_a*2+1); }
	else if (i+1 > c_a*3) { return 11 * (i-c_a*3+1); }

      },
      "font-family": "helveticaneue",
      "font-size": "9",
      "fill": function (d) {
	return colscale(d.mean);
      }
     })
    .text(function(d,i) { 
      return (i+1) + ". " + d.country + "  " + "(" + d.mean.toFixed(2) + ")";
    });

};
