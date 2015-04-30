'use strict';

// Depnedencies
var mongoose = require('mongoose'),
errorHandler = require('./error'),
lookup = require('country-data').lookup,
fs = require('fs'),
async = require("async"),
_ = require('lodash'),
users = require('../models/user'),
products = require('../models/product'),
accounts = require('../models/account'),
contacts = require('../models/contact');

module.exports.createFirst = function (req, res) {
	users.find({role: 'admin'}, {password: 0}, function (err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user.length > 0){
			res.status(200).jsonp('Admin Exists');
		} else {
			var countryInfo = lookup.countries({name: 'United Arab Emirates'})[0];
			var country = [{
				name: countryInfo.name,
				code: countryInfo.alpha2,
				callingCode: countryInfo.countryCallingCodes[0],
				currency: countryInfo.currencies[0],
				language: countryInfo.languages[0]
			}];

			var newUser = new users({
				firstName: 'munzir',
				lastName: 'suliman',
				name: 'moeAdmin',
				role: 'admin',
				email: 'munzir.suliman@outlook.com',
				password: 'Dubai@123',
				country: country
			});

			newUser.save(function(err, user){
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else {
					res.status(200).jsonp(user);
				}
			});
		}
	});
}


module.exports.index = function (req, res) {
	users.find({role: 'admin'}, {password: 0}, function (err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(user);
		}
	});
}


module.exports.users = function (req, res) {
	users.find({'role': 'user'}, {password: 0}, function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			res.status(200).jsonp({'users': user, count: user.length});
		} else {
			res.status(404).jsonp({message: 'No user has been found'});
		}
	});
}


module.exports.products = function (req, res) {
	products.find({}).populate('user').exec(function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			res.status(200).jsonp({'products': product, count: product.length});
		} else {
			res.status(404).jsonp({message: 'No product has been found'});
		}
	});
}

module.exports.orders = function (req, res) {
	users.find({'role': 'user'}).populate('order').populate('order.product.info').populate('order.user').where('order._id').exists().exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			var userOrders = user,
				sortedInfo = [];
			//Get the user order info
			userOrders.forEach(function (userInfo) {
				var orderInfo = userInfo.order;
				orderInfo.forEach(function (order) {
					sortedInfo.push({
						user: {
							_id: userInfo._id,
							name: userInfo.name
						},
						order: order
					});
				});
			});
			res.status(200).jsonp({'orders': sortedInfo, 'count': sortedInfo.length});
		} else {
			res.status(404).jsonp({message: 'No order has been found'});
		}
	});
}

module.exports.messages = function (req, res) {
	contacts.find({}, function (err, contact) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(contact){
			res.status(200).jsonp({'messages': contact, 'count': contact.length});
		} else {
			res.status(404).jsonp({message: 'No message has been found'});
		}
	});
}

module.exports.comments = function (req, res) {
	products.find({}).where('comment._id').exists().populate('comment').exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			var userComments = user,
				sortedInfo = [];
			//Get the user comment info
			userComments.forEach(function (userInfo) {
				var commentInfo = userInfo.comment;
				commentInfo.forEach(function (comment) {
					sortedInfo.push({
						user: {
							_id: userInfo._id,
							name: userInfo.name
						},
						comment: comment
					});
				});
			});

			res.status(200).jsonp({'info': sortedInfo, 'count': sortedInfo.length});
		} else {
			res.status(404).jsonp({message: 'No comment has been found'});
		}
	});
}

module.exports.hearts = function (req, res) {
	products.find({}).where('heart._id').exists().populate('heart').exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			var userhearts = user,
				sortedInfo = [];
			//Get the user heart info
			userhearts.forEach(function (userInfo) {
				var heartInfo = userInfo.heart;
				heartInfo.forEach(function (heart) {
					sortedInfo.push({
						user: {
							_id: userInfo._id,
							name: userInfo.name
						},
						heart: heart
					});
				});
			});

			res.status(200).jsonp({'info': sortedInfo, 'count': sortedInfo.length});
		} else {
			res.status(404).jsonp({message: 'No heart has been found'});
		}
	});
}

function fromToDates (userDateInput, callback) {
	var date = new Date(),
		oldDate = new Date(),
		fromDate,
		toDate;

	if(!userDateInput){
		fromDate = oldDate.setMonth(oldDate.getMonth() - 1);
		toDate = date;
	} else {
		fromDate = new Date(userDateInput.from);
		toDate = oldDate.setMonth(userDateInput.to);
	}

	callback(null, { "from": fromDate, "to": toDate});
}

module.exports.orderAnalysis = function (req, res) {
	function userDateInput (callback) {
		if(req.body.dateFrom && req.body.dateTo){
			callback(null, {"from": req.body.dateFrom, "to": req.body.dateTo});
		}
		callback(null, false);
	}
	function orders (dates, callback) {
		users.find({"order.created": {"$gte": new Date(dates.from), "$lt": new Date(dates.to)}}, 'order').populate('order').where('order._id').exists().sort('created').exec(function (err, user) {
			if(err){
				callback(err);
			} else {
				//make sense of the data
				var userInfo = user,
					result = [],
					date,
					getIndex;

				userInfo.forEach(function (info) {
					info.order.forEach(function (order) {
						date = new Date(order.created);
						if(getIndex = _.findIndex(result, function (value) {
							return value.date == date;
						}) != -1){
							console.log(getIndex);
							result[getIndex].count++;
							result[getIndex].order.push(order);
						} else {
							result.push({
								"count": 1,
								"date": date,
								"order": [order],
								"day": date.getDate().toString().length == 1 ? "0" + date.getDate(): date.getDate(),
								"month": date.getMonth().toString().length == 1 ? "0" + date.getMonth(): date.getMonth(),
								"year": date.getFullYear()
							});
						}
					});
				});
				callback(null, result);
			}
		});
	}
	async.waterfall([userDateInput, fromToDates, orders], function (err, result) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			res.status(200).jsonp(result);
		}
	});
}

module.exports.cartAnalysis = function (req, res) {
	function userDateInput (callback) {
		if(req.body.dateFrom && req.body.dateTo){
			callback(null, {"from": req.body.dateFrom, "to": req.body.dateTo});
		}
		callback(null, false);
	}
	function carts (dates, callback) {
		users.find({"cart.created": {"$gte": new Date(dates.from), "$lt": new Date(dates.to)}}, 'cart').populate('cart').where('cart._id').exists().sort('created').exec(function (err, user) {
			if(err){
				callback(err);
			} else {
				//make sense of the data
				var userInfo = user,
					result = [],
					date,
					getIndex;

				userInfo.forEach(function (info) {
					info.cart.forEach(function (cart) {
						date = new Date(cart.created);
						if(getIndex = _.findIndex(result, function (value) {
							return value.date == date;
						}) != -1){
							result[getIndex].count++;
							result[getIndex].order.push(cart);
						} else {
							result.push({
								"count": 1,
								"date": date,
								"cart": [cart],
								"day": date.getDate().toString().length == 1 ? "0" + date.getDate(): date.getDate(),
								"month": date.getMonth().toString().length == 1 ? "0" + date.getMonth(): date.getMonth(),
								"year": date.getFullYear()
							});
						}
					});
				});
				callback(null, result);
			}
		});
	}
	async.waterfall([userDateInput, fromToDates, carts], function (err, result) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			res.status(200).jsonp(result);
		}
	});
}

module.exports.commentAnalysis = function (req, res) {
	function userDateInput (callback) {
		if(req.body.dateFrom && req.body.dateTo){
			callback(null, {"from": req.body.dateFrom, "to": req.body.dateTo});
		}
		callback(null, false);
	}
	function comments (dates, callback) {
		products.find({"comment.created": {"$gte": new Date(dates.from), "$lt": new Date(dates.to)}}, 'comment').populate('comment').where('comment._id').exists().sort('created').exec(function (err, product) {
			if(err){
				callback(err);
			} else {
				//make sense of the data
				var productInfo = product,
					result = [],
					date,
					getIndex;

				productInfo.forEach(function (info) {
					info.comment.forEach(function (comment) {
						date = new Date(comment.created);
						if(getIndex = _.findIndex(result, function (value) {
							return value.date == date;
						}) != -1){
							result[getIndex].count++;
							result[getIndex].order.push(comment);
						} else {
							result.push({
								"count": 1,
								"date": date,
								"comment": [comment],
								"day": date.getDate().toString().length == 1 ? "0" + date.getDate(): date.getDate(),
								"month": date.getMonth().toString().length == 1 ? "0" + date.getMonth(): date.getMonth(),
								"year": date.getFullYear()
							});
						}
					});
				});
				callback(null, result);
			}
		});
	}
	async.waterfall([userDateInput, fromToDates, comments], function (err, result) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			res.status(200).jsonp(result);
		}
	});
}

module.exports.heartAnalysis = function (req, res) {
	function userDateInput (callback) {
		if(req.body.dateFrom && req.body.dateTo){
			callback(null, {"from": req.body.dateFrom, "to": req.body.dateTo});
		}
		callback(null, false);
	}
	function hearts (dates, callback) {
		products.find({"heart.created": {"$gte": new Date(dates.from), "$lt": new Date(dates.to)}}, 'heart').populate('heart').where('heart._id').exists().sort('created').exec(function (err, product) {
			if(err){
				callback(err);
			} else {
				//make sense of the data
				var productInfo = product,
					result = [],
					date,
					getIndex;

				productInfo.forEach(function (info) {
					info.heart.forEach(function (heart) {
						date = new Date(heart.created);
						if(getIndex = _.findIndex(result, function (value) {
							return value.date == date;
						}) != -1){
							result[getIndex].count++;
							result[getIndex].order.push(heart);
						} else {
							result.push({
								"count": 1,
								"date": date,
								"heart": [heart],
								"day": date.getDate().toString().length == 1 ? "0" + date.getDate(): date.getDate(),
								"month": date.getMonth().toString().length == 1 ? "0" + date.getMonth(): date.getMonth(),
								"year": date.getFullYear()
							});
						}
					});
				});
				callback(null, result);
			}
		});
	}
	async.waterfall([userDateInput, fromToDates, hearts], function (err, result) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			res.status(200).jsonp(result);
		}
	});
}

module.exports.productAnalysis = function (req, res) {
	function userDateInput (callback) {
		if(req.body.dateFrom && req.body.dateTo){
			callback(null, {"from": req.body.dateFrom, "to": req.body.dateTo});
		}
		callback(null, false);
	}
	function allProducts (dates, callback) {
		products.find({"created": {"$gte": new Date(dates.from), "$lt": new Date(dates.to)}}).sort('created').exec(function (err, product) {
			if(err){
				callback(err);
			} else {
				//make sense of the data
				var productInfo = product,
					result = [],
					date,
					getIndex;

				productInfo.forEach(function (info) {
					date = new Date(info.created);
					if(getIndex = _.findIndex(result, function (value) {
						return value.date == date;
					}) != -1){
						result[getIndex].count++;
						result[getIndex].order.push(info);
					} else {
						result.push({
							"count": 1,
							"date": date,
							"product": [product],
							"day": date.getDate().toString().length == 1 ? "0" + date.getDate(): date.getDate(),
							"month": date.getMonth().toString().length == 1 ? "0" + date.getMonth(): date.getMonth(),
							"year": date.getFullYear()
						});
					}
				});
				callback(null, result);
			}
		});
	}
	async.waterfall([userDateInput, fromToDates, allProducts], function (err, result) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			res.status(200).jsonp(result);
		}
	});
}


//this return full analysis of all users interaction
module.exports.usersAnalysis = function (req, res) {
	function userOrders(callback){
		users.find({}, function (err, user) {
			if(err){
				callback(err, null);
			} else if(user){
				var userInfo = user,
					allUsers = [],
					userHasOrder = [],
					userHasCart = [],
					usersCount = 0;

				userInfo.forEach(function (info) {
					usersCount++;
					allUsers.push(info._id.toString());
					if(info.order.length > 0){
						userHasOrder.push(info._id.toString());
					}
					if(info.cart.length > 0){
						userHasCart.push(info.cart);
					}
				});
				callback(null,
					{"allUsers": allUsers,
					"hasOrder": userHasOrder,
					"usersCount": usersCount,
					'hasOrderCount': userHasOrder.length,
					"userHasCart": userHasCart,
					"userHasCartCount": userHasCart.length
					});
			} else {
				callback(err, null);
			}
		});
	}

	function userProducts (callback) {
		products.find({}, function (err, product) {
			if(err){
				callback(err, null);
			} else if(product){
				var productInfo = product,
					userHasProduct = [],
					productsCount = 0,
					productHasComments = [],
					productHasCommentsCount = 0,
					productHasHearts = [],
					productHasHeartsCount = 0;

				productInfo.forEach(function (info) {
					if(info.user.length > 0){
						if(userHasProduct.indexOf(info.user[0]) == -1){
							productsCount++;
							userHasProduct.push(info.user[0].toString());
						}
						if(info.heart.length > 0){
							productHasHearts.push(info.heart);
						}
						if(info.comment.length > 0){
							productHasComments.push(info.comment);
						}
					}
				});
				callback(null,
					{"hasProduct": userHasProduct,
					"hasProductCount": productsCount,
					"productHasComments": productHasComments,
					"productHasCommentsCount": productHasComments.length,
					"productHasHearts": productHasHearts,
					"productHasHeartsCount": productHasHearts.length
					});
			} else {
				callback(err, null);
			}
		});	
	}

	async.parallel([userOrders, userProducts], function (err, result) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			var OrdersAndProductsUsers = _.union(result[0].hasOrder, result[1].hasProduct),
				hasNoProductOrOrder = _.difference(result[0].allUsers, OrdersAndProductsUsers);

			var info = {
				"allUsers": result[0].allUsers,
				"usersCount": result[0].usersCount,
				"hasOrders": result[0].hasOrder,
				"hasOrderCount": result[0].hasOrderCount,
				"hasProduct": result[1].hasProduct,
				"hasProductCount": result[1].hasProductCount,
				"hasNoProductOrOrder": hasNoProductOrOrder,
				"hasNoProductOrOrderCount": hasNoProductOrOrder.length,
				"userHasCart": result[0].userHasCart,
				"userHasCartCount": result[0].userHasCartCount,
				"productHasHearts": result[1].productHasHearts,
				"productHasHeartsCount": result[1].productHasHeartsCount,
				"productHasComments": result[1].productHasCommentsC,
				"productHasCommentsCount": result[1].productHasCommentsCount,
			}
			res.status(200).jsonp(info);
		}
	});
}