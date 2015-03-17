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
						//initiate with false assuming the product is not in the cart (dosnt really matter)
						var isInCart = false;
						//check if the product is in the cart
						userCart.forEach(function (item) {
							if(item.product.toString('utf-8').trim() === product._id.toString('utf-8').trim()){
								isInCart = true;
							}
						});
						//if the product is not in the cart then add the product to the user cart
						if(isInCart == false){
							var userItem = {
									product: product,
									quantity: 1
								};
							//save the user cart
							user.cart.push(userItem);
						}
					} else {
						var userItem = {
								product: product,
								quantity: 1
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
	//get the user in order to get his cart
	users.findById(req.user._id).populate('cart.product').exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			//loop through the user cart
			var userCart = user.cart,
				isMax = false;
			userCart.forEach(function (item) {
				//if the product in the cart is the same as the one we wants to update its quantity
				if(item.product[0]._id == req.params.productId){
					//make sure that the new "qantity" is not 0 and the "quantity" is not more than what
					//is availiable (not more than the product quantity)
					if(req.body.quantity > 0 && (req.body.quantity <= item.product[0].quantity) ){
						item.quantity = req.body.quantity;
					} else {
						//if the new "quantity" is more than the availiable "quantity" then pass true
						//to break the loop and to show a message informing the user about the case
						isMax = true;
					}
				}		
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
