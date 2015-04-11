'use strict';

//Dependencies
var fs = require("fs"),
	mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('./error'),
	products = require('../models/product');

//Assure the heart owner only can unheart!!
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

	// products.findById(req.params.id).populate('heart.user').exec(function (err, product) {
	// 	if(err){
	// 		res.status(500).jsonp(err);
	// 	} else if(product) {
	// 		var heartUser = product.heart;
	// 		heartUser.forEach(function (heart) {
	// 			if(heart.user[0]._id.toString('utf-8').trim() == req.user._id.toString('utf-8').trim()){
	// 				heart.remove();
	// 			}
	// 		});

	// 		product.save(function (err, heart) {
	// 			if(err){
	// 				res.status(500).jsonp({message: err});
	// 			} else {
	// 				res.status(200).jsonp({"heart": product.heart});
	// 			}
	// 		});
	// 	} else {
	// 		res.status(200).jsonp('Failed to unheart product!');
	// 	}
	// });
}