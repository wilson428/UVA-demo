// mainly a visualization library, but has useful tools for reading CSV files as well
var d3 = require("d3");

// library for reading and writing from disk
var fs = require("fs");

var names_1970 = d3.csv.parse(fs.readFileSync("./yob1970.txt", "utf8"));

// we're going to group names by name and look at gender ratio for each one
var names = {};

names_1970.forEach(function(name) {
	names[name.name] = names[name.name] || {};
	names[name.name][name.gender] = name.frequency;
});

for (n in names) {
	name = names[n];
	name.name = n;
	if (name.F && name.M) {
		name.odds = parseInt(name.M) / (parseInt(name.M) + parseInt(name.F));
	} else { // if name only exists in one gender
		if (name.F) {
			name.M = 0;
			name.odds = 0;
		} else {
			name.F = 0;
			name.odds = 1;
		}
	}
}

//console.log(names);

fs.writeFileSync("names_odds.csv", d3.csv.format(d3.values(names)));

var salaries = d3.csv.parse(fs.readFileSync("./salaries.csv", "utf8"));

salaries.forEach(function(employee) {
	var first_name = employee.employee.split(",")[1];
	first_name = first_name.split(" ")[1];
	employee.first_name = first_name;
	if (names[first_name]) {
		if (names[first_name].odds >= 0.85) {
			employee.gender = "Male";
		} else if (names[first_name].odds <= 0.15) {
			employee.gender = "Female";
		} else {
			employee.gender = "Unknown";
		}
	} else {
		employee.gender = "Unknown";		
	}
});

fs.writeFileSync("salaries_gender.csv", d3.csv.format(salaries));