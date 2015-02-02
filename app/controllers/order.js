'use strict';

//Dependencies
var mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('./error'),
	products = require('../models/product'),
	users = require('../models/user'),
	sms = require('../config/sms/config.sms.js'),
	email = require('../config/email/config.email.js');

//Return with all orders of a certain user
module.exports.index = function(req, res){
	products.find().or([{'user': req.user._id}, {'order.user._id': req.user._id}]).where('order').exists().exec(function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			var getProducts = product;
			var getUserOrder = [];

			//get all of the order of the selcted products
			getProducts.forEach(function (product) {
				getUserOrder = [];
				product.order.forEach(function (order) {
					//if the user is the product owner or the order creator
					if(parseInt(order.user[0]._id) == parseInt(req.user._id) || parseInt(product.user) == parseInt(req.user._id)){
						getUserOrder.push(order);
					}
				});
				//add only the orders done by the user or for the user (if product owner than he/she should see all orders)
				//if the user has no orders than that means pass the product only
				//note: if the user has no order and the product was pulled from the DB than that means the user is owner
				//check the "find query" above
				product.order = getUserOrder;
			});

			res.status(200).jsonp(getProducts);
		} else {
			res.status(404).jsonp({message: 'No order has been found'});
		}
	});
}

module.exports.getById = function (req, res) {
	products.findById(req.params.id, function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			var order = product.order.id(req.params.orderId);
			if(order){
				res.status(200).jsonp({product: product, order: order});
			} else {
				res.status(404).json({message: 'Order has not been found'});
			}
		} else {
			res.status(404).json({message: 'Product not found'});
		}
	});
}

//Create a new order for a certain product
module.exports.create = function(req, res){
	var orderInfo = req.body.info;
	var cartProductIds = '';
	var mobilePhoneNumbers = [];
	var recipientsData = [];
	orderInfo.user = req.user;

	//get the ids of all products in the user cart
	var searchCartProductIds = function () {
		var ids = [];
		var userCart = req.user.cart;
		userCart.forEach(function (item) {
			ids.push(item.productId);
		});
		return ids;
	}

	cartProductIds = searchCartProductIds();

	//find products added to the user cart
	products.find({_id: {"$in": cartProductIds }}, function (err, product) {
		var selectedProducts = product,
		productIds = [],
		cartProducts = req.user.cart,
		cartProductsCantBeOrdered = [],
		quantityCheck = '';

		//get the products ids
		selectedProducts.forEach(function (item) {
			productIds.push(item._id);
		});

		//Check the quantity & product owners mobile phone numbers
		selectedProducts.forEach(function (productItem) {
			//Get all "products" references in the cart that have quantity equals or less
			//than the products
			var quantityCheck = _.find(cartProducts, function (item) {
				return item.quantity <= productItem.quantity;
			});

			if(quantityCheck == undefined){
				cartProductsCantBeOrdered.push({"name": productItem.name, "id": productItem._id});
			}

			//get the mobile number of the product owner
			//if we get more than one product, then we will have
			//a duplicate values , but its ok as the sms module
			//takes care of the duplicated values
			mobilePhoneNumbers.push(productItem.userMobilePhone);

			//get the data of the product owner
			//if we get more than one product, then we will have
			//a duplicate values , but its ok as the sms module
			//takes care of the duplicated values
			recipientsData.push({
				"email": productItem.email,
				"firstName": productItem.firstName,
				"lastName": productItem.lastName
			});

		});

		//get the products in user cart that dosee not exist in the products
		//(i.e if a product creator has deleted a product that a user has added it to his/her cart)
		var difference = _.difference(parseInt(cartProductIds), parseInt(productIds));

		if(cartProductsCantBeOrdered.length > 0 || difference.length > 0){
			res.status(404).jsonp({message: cartProductsCantBeOrdered});
		} else {
			users.findById(req.user._id, function (err, user) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else if(user){
					//Create orders , fill up the order info in each product document in the database
					selectedProducts.forEach(function (productItem) {
						//get the product info from the product in the cart
						//the purpose is to get the quantity that has been checked above
						var productInfo = _.find(cartProducts, {'productId': productItem._id});
						productItem.quantity -= productInfo.quantity;
						orderInfo.quantity = productInfo.quantity;
						orderInfo.price = productInfo.price * productInfo.quantity;

						productItem.order.push(orderInfo);
						productItem.save();
					});

					//empty the user cart in the user session
					req.user.cart = [];
					//empty the user cart in the users database
					user.cart = [];
					user.save();

					//send sms to the product owner
					sms.sendMsg(mobilePhoneNumbers);
					email.sendEmail(recipientsData);
					res.status(200).json({"uCart": user.cart});
				} else {
					res.status(500).jsonp({message: 'User has not been found'});
				}
			});
		}
	});
}

//Update a specific product order
//only the product owner can update the order !!!!
module.exports.update = function(req, res){
	products.findOne({_id: req.params.id, user: req.user._id}, function (err, product) {
		if(err){
			res.status(500).jsonp(err);
		} else if(product){
			var order = product.order.id(req.params.orderId);
			order.statusHistory.push(req.body.statusHistory);
			order.status = req.body.status;
			product.save(function (err, updatedOrder) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else if(order){
					res.status(200).jsonp({product: product, order: order});
				} else {
					res.status(401).jsonp({message: 'Failed to update order info'});
				}
			});
		} else {
			res.status(404).jsonp('Product has not been found');
		}
	});
}

//Delete a specific product and a specific order
module.exports.delete = function(req, res){
	products.findOneAndUpdate({_id: req.params.id}, {$pull: {'order': {'_id': req.params.orderId, 'user._id': req.user._id}} }, function (err) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp('order has been deleted successfully');
		}	
	});
}