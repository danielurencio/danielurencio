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
		  .append("div")
		    .append("svg")
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
			.attr("transform", "translate(20, -25)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(function() { return "Y"; });

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

			  var vals = d.values.map(function(m) { return m.value } );
			  var mean = d3.mean(vals);
			  m.push(mean);
			  var col = m[m.length-1];
			  colorStroke = color(col);
		}		
		    svg.append("path")
			.attr("class", "line")
			.attr("d", line(d.values))
			.style("stroke", function(e) {
			    return colorStroke;
			} );
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

  var c = config;


//	function chart(data) {

		var svg = d3.select(selection)
		  .append("div")
		    .append("svg")
			.style({
			    "margin": "auto",
			    "display": "block",
			    "width": h,
			    "height": 500
			})
			.append("g")
			.attr({
			    "class": "graph",
			    "transform": "translate(0,20)"
			});


	var x = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.x; })])
		.range([0, height]);

	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.y; })])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("right");

		svg.selectAll("circle")
		    .data(data)
		    .enter()
		    .append("circle")
		    .attr({
			"cx": function(d) { return x(d.x); },
			"cy": function(d) { return y(d.y); },
			"r": "5",
			"fill": "red"
		    });


		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
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

		
//	};


//    return chart(data);
  

};

