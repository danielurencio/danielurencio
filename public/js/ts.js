
var headerHeight = parseInt(d3.select("div.header").style("height"));
var htmlHeight = parseInt(d3.select("html").style("height"));
var remainingHeight = htmlHeight - headerHeight - 7;


var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//var formatDate = d3.time.format("%d-%b-%y");
var formatDate = d3.time.format("%b %Y");
var date = d3.time.format("%Y");



queue()
    .defer(d3.json, "/data.json")
    .defer(d3.json, "/03.json")
    .await(graph);



function graph(error, data, CO2) {
  if (error) throw error;

  // México 144, Venezuela 236
  
  var data = data.Countries[170].data;

  CO2.forEach(function(d) {
	d.year = d3.time.format("%Y").parse(d.year);
	d.value = +d.value;
  });

  data.forEach(function(d) {
    d[0] = date.parse(String(d[0]));
    d[1] = d[1] / 1;
  });

    var config = {
	    "width": width,
	    "height": height,
	    "stroke": "steelblue",
	    "width": "0.5",
	    "ticks": "steelblue",
	 //   "font": "lane",
	    "fill": "steelblue",
	    "xdisplay": "none",
	    "ydisplay": "inline"
    };


   ts(CO2, "body", config); 
};

  function type(d) {
    d.date = formatDate.parse(d.date);
    d.price = +d.price;
    return d;
  }

