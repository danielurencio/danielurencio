var ml = require("./testgd");
var docs = ml.docs;
var o = ml.process(docs, "Sales");
var config = {"iter": 1500, "alpha": 0.01 };
console.log(ml.cost(o));
console.log(ml.gd(o, config));
