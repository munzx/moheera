'use strict';

//Dependencies
var mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('./error'),
	products = require('../models/product');


module.exports.index = function (req, res) {
	products.findById(req.params.id, function (err, product) {
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
			var isHearted = function () {
				var hearts = product.heart;
				hearts.forEach(function (item) {
					if(_.find(item.user, function (heartUser) { return heartUser._id === req.user._id; }) !== undefined){
						return true;
					}
				});
				return false;
			};

			//check if the user has hearted the product then save or return error is its already hearted
			if(isHearted() === false){
				var heartInfo = req.body;
				heartInfo.user = req.user;
				product.heart.push(heartInfo);
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
				res.status(401).json({message: 'You have already hearted the product'});
			}

		} else {
			res.status(404).json({message: 'No product has been found!'});
		}
	});
}

//Assure the heart owner only can unheart!!
module.exports.delete = function (req, res) {
	products.findOneAndUpdate({_id: req.params.id}, {$pull: {'heart': { 'user._id': req.user._id }} }, function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product) {
			res.status(200).jsonp({"heart": product.heart});
		} else {
			res.status(200).jsonp('Failed to unheart product!');
		}
	});
}