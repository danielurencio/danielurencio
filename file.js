var d3 = require("d3");
var under = require("underscore");
var fs = require("fs");

var D01 = require("./final/14.json"); // Population growth.
var D02 = require("./final/12.json"); // % of fossil consumption.
var electricityconsumption = require("./final/10.json");
var urbanpop = require("./final/11.json");
var co2percapita = require("./final/01.json");

var metano = require("./final/04.json");
var totalpop = require("./final/13.json");

//console.log(urbanpop);

function scatterAverage(d1,d2,filename) {

	d1nest = d3.nest().key(function(d) { return d.country }).entries(d1);
	d2nest = d3.nest().key(function(d) { return d.country }).entries(d2);

	var d1names = d1nest.map(function(d) { return d.key; });
	var d2names = d2nest.map(function(d) { return d.key; });

	var intersected = under.intersection(d1names, d2names);

	var d1 = [], d2 = [];
	for(var i in intersected) {

	    d1nest.forEach(function(d) {
		if ( intersected[i] == d.key ) {
		    d.values.forEach(function(m) {
			d1.push({ country: d.key, year: m.year, v1: m.value });
		    });
		}


	    });

	    d2nest.forEach(function(d) {
		if ( intersected[i] == d.key ) {
		    d.values.forEach(function(m) {
			d2.push({ country: d.key, year: m.year, v2: m.value });
		    });
		}
	    })
	} 


	d1nest = d3.nest().key(function(d) { return d.country }).entries(d1);
	d2nest = d3.nest().key(function(d) { return d.country }).entries(d2);

	var years = [[],[]];

	for(var i=0; i<=d1nest.length-1; i++) {
	   years[0].push( d1nest[i].values);
	}

	for(var i=0; i<=d1nest.length-1; i++) {
	   years[1].push( d2nest[i].values);
	}

	var lns = [ [], [] ];

	for(var i=0; i<=years[0].length-1; i++) {
	   lns[0].push(years[0][i].length);
	   lns[1].push(years[1][i].length);
	}


	var a, b;
	function a() {
	    a = years[0], b = years[1];
	}

	function b() {
	    b = years[0], a = years[1];
	}

	d3.sum(lns[0]) >= d3.sum(lns[1]) ? a() : b();

	var feats = [];
	for(var p=0; p<=years[0].length-1;p++) {

		for(var i=0; i<= years[0][p].length-1; i++) {

		    for(var j=0; j<= years[1][p].length-1; j++) {
//	console.log(p, i, j);
			if( years[1][p][j].year == years[0][p][i].year ) {
			    feats.push({
				country: years[0][p][i].country,
				year: years[0][p][i].year, 
				x1: years[0][p][i].v1,
				x2: years[1][p][j].v2 
			    });
			}
		    }
		}
	}

	var feats = d3.nest().key(function(d) { return d.country }).entries(feats);
	var f = [];
//console.log(feats[166]);
	feats.forEach(function(d) {
	    var fp = d.values[0].year, lp = d.values[d.values.length-1].year;
	    var pop = d.values.map(function(m) { return m.x1; } );
	    var fossil = d.values.map(function(m) { return m.x2; } );
	    var meanpop = d3.mean(pop);
	    var meanfossil = d3.mean(fossil);
	    f.push({
		country: d.key,
		x1: meanpop,
		x2: meanfossil,
		period: String(fp) + "-" + String(lp)
	    });
	});

/*
for(var i in f) {
    if(f[i].x1 == 0 || f[i].x2 == 0) {
	f.splice( f.indexOf(f[i]), 1);
    //console.log(f[i]);
    }
}
*/


var ff = [];
for(var i in f) {
    if(f[i].x1 != 0) {
	ff.push(f[i]);
    }
}
f = ff;

console.log(f.length);
f.forEach(function(d) {
//    console.log(d.country, d.x1, d.x2);
})

    if(filename && typeof(filename) == "string") {
	f = JSON.stringify(f);
	fs.writeFile("./" + filename + ".json", f, "utf8");
	console.log(filename + ".json created.");
    }
}


scatterAverage(totalpop, metano,"16");

//////////////////////////////////////////////////////////////
// Population size and emissions from latest available year.
////////////////////////////////////////////////////////////

/* I want to show how have the emissions behaved in 2014 in relation to a country's population size */

var popsize = require("./final/13.json");
var co2 = require("./final/03.json");


function scatterOneYear(pop,em,year) {
    if ( typeof(year) != "string" ) { year = Number(year); }
    var a, b;
//    pop.length > em.length ? a() : b();

    function a() { a = pop, b = em }; function b() { b = pop, a = em};
a();

    d1nest = d3.nest().key(function(d) { return d.country }).entries(a);
    d2nest = d3.nest().key(function(d) { return d.country }).entries(b);

    var d1names = d1nest.map(function(d) { return d.key; });
    var d2names = d2nest.map(function(d) { return d.key; });

    var intersected = under.intersection(d1names, d2names);
    var difference = under.difference(d1names, d2names);


    var d1 = [], d2 = [];
	for(var i in intersected) {

	    d1nest.forEach(function(d) {
		if ( intersected[i] == d.key ) {
		    d.values.forEach(function(m) {
			d1.push({ country: d.key, year: m.year, v: m.value });
		    });
		}


	    });

	    d2nest.forEach(function(d) {
		if ( intersected[i] == d.key ) {
		    d.values.forEach(function(m) {
			d2.push({ country: d.key, year: m.year, v: m.value });
		    });
		}
	    })
	}

    d1nest = d3.nest().key(function(d) { return d.country }).entries(d1);
    d2nest = d3.nest().key(function(d) { return d.country }).entries(d2);

    var years = [[],[]];

    d1nest.forEach(function(d) {
	d.values.forEach(function(e) {
	    if( e.year == year ) { years[0].push(e); }
	})
    });

    d2nest.forEach(function(d) {
	d.values.forEach(function(e) {
	    if( e.year == year ) { years[1].push(e); }
	})
    });
//console.log(years[1]);
   var feats = []; 
    if ( years[0].length == years[1].length ) {
        for(var i=0; i<= years[0].length-1; i++) {
	    if ( years[0][i].country == years[1][i].country ) {
		feats.push({
		    country: years[0][i].country,
		    x1: years[0][i].v,
		    x2: years[1][i].v,
		    year: years[0][i].year 
		});
	    }
        }
    }
    else { console.log("The year does not coincide between the datasets!"); }

    f = JSON.stringify(feats);
    fs.writeFile("./16.json", f, "utf8");
};

//scatterOneYear(popsize, co2, 2011);
