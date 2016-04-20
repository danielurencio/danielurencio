
var headerHeight = parseInt(d3.select("div.header").style("height"));
var htmlHeight = parseInt(d3.select("html").style("height"));
var remainingHeight = htmlHeight - headerHeight - 7;


var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    h = 500;

//var formatDate = d3.time.format("%d-%b-%y");
var formatDate = d3.time.format("%b %Y");
var date = d3.time.format("%Y");



queue()
//    .defer(d3.json, "/data.json")
    .defer(d3.json, "/final/12.json")
    .await(graph);


function graph(error, D01) {
  if (error) throw error;

	var country = [];
	D01.forEach(function(d) {   // Filtro de países
		if (d.country == "China") {
		    country.push(d);
		}

	});

var sacar = [
'El mundo árabe', 
'Estados pequeos del Caribe', 
'Asia oriental y el Pacífico', 
'Asia oriental y el Pacífico (todos los niveles de ingreso)', 
'Zona del Euro', 
'Unión Europea', 
'Países pobres muy endeudados', 
"Ingreso alto", 
"Países pobres muy endeudados (PPME)", 
"América Latina y el Caribe (países en desarrollo solamente)", 
"América Latina y el Caribe (todos los niveles de ingreso)", 
"Países menos desarrollados: clasificación de las Naciones Unidas", 
"Países de ingreso mediano bajo", 
"Ingreso mediano y bajo","Oriente Medio y Norte de África (todos los niveles de ingreso)",
"Países de ingreso bajo",
"Ingreso mediano y bajo",
" Ingreso mediano", 
"Oriente Medio y Norte de África", 
"Oriente Medio y Norte de África (todos los niveles de ingreso)",
"América del Norte", 
"Ingreso alto: Miembros de OCDE",
"Ingreso alto: No miembros de OCDE", 
"Miembros OCDE", 
"Estados pequeos de las Islas del Pacfico", 
"Otros Estados pequeos",
"Asia meridional", 
"África al sur del Sahara", 
"África al sur del Sahara (todos los niveles de ingreso)", 
"Pequeños Estados", 
"Ingreso mediano alto", 
"Mundo",
"Europa y Asia central",
"Europa y Asia central (todos los niveles de ingreso)"
];

	for(var i in sacar) {
		D01 = D01.filter(function(d) {
		    return d.country != sacar[i];
		});
	}	

	var unique = d3.nest()
		.key(function(d) { return d["country"]; })
		.entries(D01);

	var sc = [];

	unique.forEach(function(d) {
	    console.log( d.values );
	});

	var names = unique.map(function(d) { return d.key; });
	//console.log(names);


    var config = {
//	    "width": width,
//	    "height": height,
	    "stroke": "steelblue",
	    "Lwidth": "0.8",
	    "ticks": "steelblue",
	 //   "font": "lane",
	    "fill": "steelblue",
	    "xdisplay": "none",
	    "ydisplay": "inline",
	    "dateformat": "%Y"
    };

    var title = {
	    "text-align": "center",
	    "padding-top": "20px",
	    "font-family": "ahellyaitalic",
	    "font-size": "50px",
	    "color": "steelblue"
    };

    d3.select("body").append("div")
	.text("Graph")
	.style(title);

var points = [{ x: 50, y: 50 }, { x: 20, y: 20 }];

    ts(D01, "body", config);
//    scatter(points, "body", config);

};

  function type(d) {
    d.date = formatDate.parse(d.date);
    d.price = +d.price;
    return d;
  }
