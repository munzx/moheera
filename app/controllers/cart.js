'use strict';

//Dependencies
var mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('./error'),
	users = require('../models/user'),
	products = require('../models/product');


module.exports.index = function (req, res) {
	users.findById(req.user._id, function (err, user) {
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
	users.findById(req.user._id, function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			var newCart = {
				name: req.body.product.name,
				desc: req.body.product.desc,
				category: req.body.product.category,
				price: req.body.product.price,
				image1: req.body.product.image1,
				image2: req.body.product.image2,
				image3: req.body.product.image3,
				image4: req.body.product.image4,
				user: req.body.product.user,
				userName: req.body.product.userName,
				productId: req.params.productId
			};
			//Check if the user has alraedy added the product to the cart, if not proceed
			if(_.find(user.cart, {'productId': newCart.productId}) == undefined){
				user.cart.push(newCart);
				user.save(function (err, userInfo) {
					if(err){
						res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
					} else if(newCart){
						res.status(200).jsonp({"cart": userInfo.cart});
					} else {
						res.status(401).json({message: 'Failed to add new product to the cart'});
					}
				});				
			} else {
				res.status(401).json({message: 'Product already in cart!'});
			}
		} else {
			res.status(404).jsonp({message: 'User has not been found'});
		}
	});
}

module.exports.updateProduct = function (req, res) {
	users.findById(req.user._id, function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			//get the user cart
			var userCart = user.cart;
			var cartProduct = req.body.product;

			products.findById(cartProduct.productId, function (err, product) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else if(product){
					//update the quantity of the products in the user cart
					if(product.quantity >= cartProduct.quantity && cartProduct.quantity > 0){
						//find the product in the user cart
						var getUserCartProduct = user.cart.id(cartProduct._id);
						getUserCartProduct.quantity = cartProduct.quantity;
						user.save(function (err, cart) {
							if(err){
								res.status(401).jsonp({message: errorHandler.getErrorMessage(err)});
							} else if(cart){
								res.status(200).jsonp({"cart": userCart});
							} else {
								res.status(500).jsonp({message: "Unknown error has occured"});
							}
						});
					} else {
						res.status(404).jsonp({message: 'The available quantity is ' + product.quantity});
					}
				} else {
					res.status(404).jsonp({message: 'Could not add more, quantity not available'});
				}
			});
		} else {
			res.status(404).jsonp({message: "User has not been found"});
		}
	})	
}

module.exports.removeProduct = function (req, res) {
	users.findById(req.user._id, function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			var cartInfo = user.cart;
			cartInfo.forEach(function (item) {
				if(req.params.productId == item.productId){
					item.remove();
				}
			});
			user.save(function (err, userInfo) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else {
					res.status(200).json({"cart": userInfo.cart});
				}
			})
		} else {
			res.status(404).json({message: 'User has not been found'});
		}
	});
}
