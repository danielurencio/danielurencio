
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
    .defer(d3.json, "/final/01.json")
    .defer(d3.json, "/final/02.json")
    .defer(d3.json, "/final/03.json")
    .defer(d3.json, "/final/04.json")
    .defer(d3.json, "/final/05.json")
    .defer(d3.json, "/final/06.json")
    .defer(d3.json, "/final/07.json")
    .defer(d3.json, "/final/08.json")
    .defer(d3.json, "/final/09.json")
    .defer(d3.json, "/final/10.json")
    .defer(d3.json, "/final/11.json")
    .defer(d3.json, "/final/12.json")
    .defer(d3.json, "/final/13.json")
    .defer(d3.json, "/final/14.json")
    .defer(d3.json, "/16.json")
  //  .defer(d3.json, "/ff.json")
    //.defer(d3.json, "/popgrowVSurban.json")
    .await(graph);




function graph(error, D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12, D13, D14, e) {
   var args = [D01,D02,D03,D04,D05,D06,D07,D08,D09,D10,D11,D12,D13,D14];
  
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
"Europa y Asia central (todos los niveles de ingreso)",
/*"China",
"Estados Unidos",
"India",
"Federación de Rusia",
"Japón",
"Alemania"*/
];

  //for(var j in args) {

//    if(d != null) {
	for(var i in sacar) {
		e = e.filter(function(d) {
		    return d.country != sacar[i];
		});
	}
//    }	
//});
	var unique = d3.nest()
		.key(function(d) { return d["country"]; })
		.entries(D01);



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

var feat = feats(D01)
var d2 = feats(D02)

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

    var config1 = {
	    "stroke": "steelblue",
	    "Lwidth": "0.8",
	    "ticks": "steelblue",
	    "fill": "steelblue",
	    "xdisplay": "none",
	    "ydisplay": "none",
	    "dateformat": "%Y",
	    "xlog": true
    };


    var title = {
	    "text-align": "center",
	    "padding-top": "20px",
	    "font-family": "ahellyaitalic",
	    "font-size": "50px",
	    "color": "steelblue"
    };

var themes = [
"pob", "internet",
];
var dd = themes[0];
    d3.select("body").append("div")
	.text("Crecimiento poblacional")
	.style(title);

    d3.select("body").append("div")
	.append("svg").attr("class", "themes")
	.style({
//	    "class": "themes",
	    "height": "27",
	    "margin": "auto",
	    "display": "block"
	})
	.selectAll("rect").data(themes).enter()
	.append("rect")
	.attr({
	    "x": function(d,i) { return 16.5 * (i); },
	    "y": 0,
	    "width": 15,
	    "height": 15,
	    "stroke": "steelblue",
	    "stroke-width": "0.5",
	    "fill": "transparent",
	    "fill-opacity": "0.5"
	})
	.on("click", function(d) {
	    if(d=="internet") {
		d3.select(".content1").remove();
		ts(D09,"body",config);
	    }
	});

console.log(feats(D14).length)
//    ts(D14, "body", config);
//    enlist( feats(D14),"body");
    scatter(e, "body", config1);
//    scatter(D05, "body", config1);

d3.select("body").style("height", "1300px");

};

/*
  function type(d) {
    d.date = formatDate.parse(d.date);
    d.price = +d.price;
    return d;
  }
*/
