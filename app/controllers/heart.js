'use strict';

//Dependencies
var mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('./error'),
	products = require('../models/product');


module.exports.index = function (req, res) {
	products.findById(req.params.id).populate('user').exec(function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			var heart = product.heart;
			if(heart){
				if(_.find(heart, {_id : req.user._id}) === undefined){
					res.status(200).jsonp(heart);
				} else {
					heart.isHearted = true;
					res.status(200).jsonp(heart);
				}
			} else {
				res.status(404).jsonp({message: 'No heart has been found!'});
			}
		} else {
			res.status(404).json({message: 'No product has been found!'});
		}
	});
}

module.exports.create = function (req, res) {
	products.findById(req.params.id, function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			//if the product is not hearted by the user then return true else resturn false
				var hearts = product.heart;
				if(hearts.length >= 1){
					if(_.find(hearts, function (item) {
						return item.user[0] == req.user._id;
					}) == undefined){
						var heartInfo = {};
						heartInfo.user = req.user;
						product.heart.push(heartInfo);	
					}
				} else {
					var heartInfo = req.body;
					heartInfo.user = req.user;
					product.heart.push(heartInfo);					
				}

				product.save(function (err, newHeart) {
					if(err){
						res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
					} else if(newHeart){
						res.status(200).jsonp({"heart": newHeart.heart});
					} else {
						res.status(401).json({message: 'Failed to add heart'});
					}
				});
		} else {
			res.status(404).json({message: 'No product has been found!'});
		}
	});
}

//Assure the heart owner only can unheart!!
module.exports.delete = function (req, res) {
	products.findById(req.params.id).populate('heart.user').exec(function (err, product) {
		if(err){
			res.status(500).jsonp(err);
		} else if(product) {
			var heartUser = product.heart;
			heartUser.forEach(function (heart) {
				if(heart.user[0]._id.toString('utf-8').trim() == req.user._id.toString('utf-8').trim()){
					heart.remove();
				}
			});

			product.save(function (err, heart) {
				if(err){
					res.status(500).jsonp({message: err});
				} else {
					res.status(200).jsonp({"heart": product.heart});
				}
			});
		} else {
			res.status(200).jsonp('Failed to unheart product!');
		}
	});
}