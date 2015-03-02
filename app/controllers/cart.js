'use strict';

//Dependencies
var mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('./error'),
	users = require('../models/user'),
	products = require('../models/product');


module.exports.index = function (req, res) {
	users.findById(req.user._id).populate('cart.product').exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			res.status(200).jsonp(user.cart);
		} else {
			res.status(404).jsonp({message: 'User has not been found'});
		}
	});
}

module.exports.addProduct = function (req, res) {
	products.findById(req.params.productId, function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			users.findById(req.user._id).populate('cart.product').exec(function (err, user) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else {
					//only add the product to the cart if the product was not already added
					var userCart = user.cart;
					if(userCart.length >= 1){
						userCart.forEach(function (item) {
							if(item.product[0]._id.toString('utf-8').trim() !== product._id.toString('utf-8').trim()){
								console.log(item.product[0]._id);
								console.log(product._id);
								var userItem = {
										product: product,
										quantity: req.body.product.quantity
									};
								//save the user cart
								user.cart.push(userItem);							
							}
						});
					} else {
						var userItem = {
								product: product,
								quantity: req.body.product.quantity
							};
						//save the user cart
						user.cart.push(userItem);
					}

					user.save(function (err, userInfo) {
						if(err){
							res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
						} else {
							res.status(200).jsonp({"cart": userInfo.cart});
						}
					});
				}
			});
		} else {
			res.status(500).jsonp({message: 'Product has not been found'});
		}
	});
}

module.exports.updateProduct = function (req, res) {
	users.findById(req.user._id).populate('cart.product').exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			var userCart = user.cart,
				isMax = false;
			userCart.forEach(function (item) {
				if( req.body.quantity > 0 && (req.body.quantity <= item.product[0].quantity) ){
					item.quantity = req.body.quantity;
				} else {
					isMax = true;
				}		
				console.log(item.product[0].quantity);
			});
			user.save(function (err, userInfo) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else {
					if(isMax){
						res.status(404).jsonp({message: 'Could not add more, quantity not available'});
					} else {
						res.status(200).jsonp({"cart": userCart});
					}
				}
			});
		} else {
			res.status(404).jsonp({message: "User has not been found"});
		}
	});
}

module.exports.removeProduct = function (req, res) {
	users.findById(req.user._id).populate('cart.product').exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			var cartInfo = user.cart;
			cartInfo.forEach(function (item) {
				if(req.params.productId.toString('utf-8').trim() == item.product[0]._id.toString('utf-8').trim()){
					item.remove();
				}
			});
			user.save(function (err, userInfo) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else if(userInfo) {
					res.status(200).json({"cart": userInfo.cart});
				} else {
					res.status(404).json({message: 'Product has not been found'});
				}
			});
		} else {
			res.status(404).json({message: 'User has not been found'});
		}
	});
}
