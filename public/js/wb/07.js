
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
   .defer(d3.json, "/final/07.json")
    .await(graph);




function graph(error, D07) {
  
  if (error) throw error;

	var country = [];
	D07.forEach(function(d) {   // Filtro de países
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
"Europa y Asia central (todos los niveles de ingreso)",
/*"China",
"Estados Unidos",
"India",
"Federación de Rusia",
"Japón",
"Alemania"*/
];

 	for(var i in sacar) {
		D07 = D07.filter(function(d) {
		    return d.country != sacar[i];
		});
	}

// Compute rates of change between each period..
function rates(obj) {
var sc = [];
	obj.forEach(function(d) {
	    var val = d.values.map(function(d) { return d.value; } );
	    
	    for (var i=0; i<=val.length-2; i++) {
		var a = ( (val[i+1] - val[i]) / val[i] ) * 100;
		var y = Number(d.values[0].year) + 1;
		sc.push({country: d.key, year: String(y + i), value: a});
	
	    }
	});
   return sc;
};

function feats(obj) {
// A function to get means ... 
var feats = [];
	d3.nest()
	.key(function(d) { return d.country; })
	.entries(obj)
	.forEach(function(d) {
	    var a = d.values.map(function(d) { return d.value; });
	    var mean = d3.mean(a);
	    var dev = d3.deviation(a);
	    feats.push({ country: d.key, mean: mean, dev: dev });
	});
   return feats;
}

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

    var config1 = {
	    "stroke": "steelblue",
	    "Lwidth": "0.8",
	    "ticks": "steelblue",
	    "fill": "steelblue",
	    "xdisplay": "none",
	    "ydisplay": "none",
	    "dateformat": "%Y",
	   // "xlog": true
    };


    var title = {
	    "text-align": "center",
	    "padding-top": "20px",
	    "font-family": "ahellyaitalic",
	    "font-size": "50px",
	    "color": "steelblue"
    };

    d3.select("body").append("div")
	.text("Óxido nitroso por agricultura")
	.style(title);

        ts(D07, "body", config);
    enlist( feats(D07),"body");

d3.select("body").style("height", "1300px");

};
