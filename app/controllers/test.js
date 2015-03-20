'use strict';

//Dependencies
var lookup = require('country-data').lookup;

module.exports.index = function (req, res) {
	var france = lookup.countries({name: 'United Kingdom'})[0];
	res.status(200).json(france);
}