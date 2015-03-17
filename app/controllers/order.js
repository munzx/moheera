'use strict';

//Dependencies
var mongoose = require('mongoose'),
	async = require("async"),
	_ = require('lodash'),
	errorHandler = require('./error'),
	products = require('../models/product'),
	users = require('../models/user'),
	sms = require('../config/sms/config.sms.js'),
	email = require('../config/email/config.email.js'),
	randomstring = require("randomstring");

//Return with all orders of a certain user
module.exports.index = function(req, res){
	users.find().or([{'_id': req.user._id}, {'order.user': req.user._id}]).where('order._id').exists().populate('order.product.info').exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			var userInfo = user,
				orders = [],
				userId = req.user._id;

			userInfo.forEach(function (info) {
				var order = info.order;
				order.forEach(function (orderInfo) {
					if(info._id.toString('utf-8').trim() == req.user._id.toString('utf-8').trim() || orderInfo.user.toString('utf-8').trim() == req.user._id.toString('utf-8').trim()){
						orders.push(orderInfo);
					}
				});
			});

			res.status(200).jsonp(_.sortBy(orders, 'created').reverse());
		} else {
			res.status(404).jsonp({message: 'No order has been found'});
		}
	});
}

module.exports.getById = function (req, res) {
	users.findOne().where({"order._id": req.params.orderId}).populate('order.product.info').populate('order.user').exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			//owner id the products owner
			res.status(200).jsonp({'owner': user ,'order': user.order.id(req.params.orderId)});
		} else {
			res.status(404).json({message: 'order not found'});
		}
	});
}

//Create a new order for a certain product
module.exports.create = function(req, res){
	var orderInfo = req.body.info,
		mobilePhoneNumbers = [],
		emailAddresses = [],
		totalPrice = 0,
		totalQuantity = 0;
	
	//get the order info
	orderInfo.user = req.user;

	//find the user and get his/her cart product info
	users.findById(req.user._id).populate('cart.product').exec(function (err, userInfo) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(userInfo){
			async.series([function (callback) {
					//generate a unique number
					orderInfo.serialNumber = randomstring.generate(7) + Math.floor(new Date() / 1000);
					//populate the product user info
					users.populate(userInfo, {path: 'cart.product.user', model: 'user'}, function (err, productUser) {
						var productOrder = productUser.cart;
						//loop through all products in the cart
						productOrder.forEach(function (item) {
							//get product owner mobile phone if exists
							if(item.product[0].user[0].mobilePhone){
								mobilePhoneNumbers.push(item.product[0].user[0].mobilePhone);	
							}
							//get product owner email if exists
							if(item.product[0].user[0].email){
								emailAddresses.push(item.product[0].user[0].email);	
							}
							//add the order info to the product owner
							//if the customer wants more than one product from a user
							//then add all of the ordered product to a one order
							//other wise make an order for each product for each user
							var checkAndGetIfExists = _.find(item.product[0].user[0].order, function (cartItem) {
													return cartItem.serialNumber == orderInfo.serialNumber;
												});
							//if the order number dose not exist i.e just one product in the order then make a new order
							//other wise just add the product order to the user orders
							if(checkAndGetIfExists == undefined){
								if(item.product[0].quantity >= item.quantity){
									orderInfo.quantity = item.quantity;
									orderInfo.price = item.product[0].price * item.quantity;
									var newOrderProductInfo = [{"info": item.product[0]._id, "quantity": item.quantity, "price": item.product[0].price * item.quantity}];
									orderInfo.product = newOrderProductInfo;
									item.product[0].user[0].order.push(orderInfo);
									item.product[0].quantity -=  item.quantity;
								} else {
									callback('product quantity is less than the ordered quantity');
								}
							} else {
								if(checkAndGetIfExists.quantity >= item.quantity){
									//add the product quantity to the order quantity
									//add the product total price (product price * quantity ordered in cart) to the order price
									checkAndGetIfExists.price += (item.quantity * item.product[0].price);
									checkAndGetIfExists.quantity += item.quantity;
									var newOrderProductInfo = {"info": item.product[0], "quantity": item.quantity, "price": item.product[0].price * item.quantity};
									checkAndGetIfExists.product.push(newOrderProductInfo);
									item.product[0].quantity -=  item.quantity;
								} else {
									callback('product quantity is less than the ordered quantity');
								}
							}

							//save user order
							item.product[0].save();
							item.product[0].user[0].save();
						});
						callback(null);
					});
			}, function (callback) {
				//empty user cart
				users.findOneAndUpdate({_id: req.user._id}, {"cart": []}, function (err, user) {
					if(err){
						callback(err);
					} else {
						callback(null);
					}
				});
			}], function (err, result) {
				//respond to user
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else {
					//send sms to the product owner
					sms.sendMsg(mobilePhoneNumbers);
					//send email to the product owner
					email.sendEmail(emailAddresses);
					res.status(200).json({"uCart": req.user.cart});
				}
			});
		} else {
			res.status(500).jsonp({message: 'user has not been found'});
		}
	});

}

//Update a specific product order
//only the product owner can update the order !!!!
module.exports.update = function(req, res){
	users.findOne({_id: req.user._id}).populate('order.product.info').populate('order.user').exec(function (err, user) {
		if(err){
			res.status(500).jsonp(err);
		} else if(user){
			var order = user.order.id(req.params.orderId);
			order.statusHistory.push(req.body.statusHistory);
			order.status = req.body.status;
			user.save(function (err, updatedOrder) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else if(order){
					res.status(200).jsonp({"order": user.order.id(req.params.orderId)});
				} else {
					res.status(401).jsonp({message: 'Failed to update order info'});
				}
			});
		} else {
			res.status(404).jsonp('Product has not been found');
		}
	});
}

//Delete a specific product in a specific order
module.exports.delete = function(req, res){
	products.findOneAndUpdate({_id: req.params.id}, {$pull: {'order': {'_id': req.params.orderId, 'user._id': req.user._id}} }, function (err) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp('order has been deleted successfully');
		}	
	});
}