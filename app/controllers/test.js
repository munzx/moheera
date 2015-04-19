'use strict';

//Dependencies
var fs = require("fs"),
	mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('./error'),
	products = require('../models/product');

module.exports.index = function (req, res) {
	//remove products with no user
	products.find().populate('user').exec(function (err, product) {
		if(err){
			res.status(500).jsonp('Error has occured');
		} else if(product){
			var allProducts = product,
			dest = 'public/uploads/';
			allProducts.forEach(function (item) {
				if(item.user.length == 0){
					fs.unlink(dest + item.image1);
					fs.unlink(dest + item.image2);
					fs.unlink(dest + item.image3);
					fs.unlink(dest + item.image4);
					item.remove();
					item.save();
				}
			});
			res.status(200).jsonp('products with no users have been removed successfully');
		} else {
			res.status(500).jsonp('No product has been found');	
		}
	});
}