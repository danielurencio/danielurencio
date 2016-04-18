var ts = function(da, selection, config) {
   
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
	    .x(function(d) { return x(d.year); })
	    .y(function(d) { return y(d.value); });


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
		.orient("left");



if(!multi) {
	x.domain(d3.extent(data, function(d) { return d[0]; }));
	y.domain(d3.extent(data, function(d) { return d[1]; }));
}
else {
        x.domain(d3.extent(data, function(d) { return d.year; }));
	y.domain([0,d3.max(data, function(d) { return d.value; })]);

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
			    "transform": "translate(50,20)"
			});

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "translate(20, -10)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(function() { return c.ylabel || "Y"; });

	if(!multi) {
		svg.append("path")   //line generation
//			.datum(data)
			.attr("class", "line")
			.attr("d", line(data));
         }
	 else {
	        data.forEach(function(d) {
		    svg.append("path")
//			.datum(d.values)
			.attr("class", "line")
			.attr("d", line(d.values));
		});
	 }


		d3.selectAll(".line").style({// 
			"stroke": function() { return c.stroke || "black"; },
			"stroke-width": function() { return c.width || "1"; },
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

		d3.select(".graph").style({
		    "font-family": function() { return c.font || "helvetica" },
		    "fill": function() { return c.fill || "black" }
		});

		d3.selectAll(".tick").style({
		    "font-size": "8.5"
		});

		
	};


    return chart(data);
  

};


