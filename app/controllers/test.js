'use strict';

//Dependencies
var products = require('../models/product');

module.exports.index = function (req, res) {
	products.find({name: 'koko'}).populate('user').exec(function (err, product) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			res.status(200).jsonp(product);
		}
	});
}