'use strict';

// Depnedencies
var mongoose = require('mongoose'),
errorHandler = require('./error'),
lookup = require('country-data').lookup,
fs = require('fs'),
async = require("async"),
_ = require('lodash'),
users = require('../models/user'),
category = require('../models/category'),
products = require('../models/product'),
accounts = require('../models/account'),
contacts = require('../models/contact'),
moment = require('moment'),
lineChart = require('../helpers/lineChart'),
dateInput = require('../helpers/dateInput'),
isValidParentCategory = require('../helpers/isValidParentCategory');

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
	var limit = 0,
	skip = 0;

	if(req.params.limit){
		limit = req.params.limit;
	}

	if(req.params.skip){
		skip = req.params.skip;
	}

	users.find({'role': 'user'}, {password: 0}, {limit: req.params.limit, skip: req.params.skip}).sort({created: -1}).exec(function (err, user) {
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
	var limit = 0,
	skip = 0;

	if(req.params.limit){
		limit = req.params.limit;
	}

	if(req.params.skip){
		skip = req.params.skip;
	}

	products.find({}, {}, {limit: limit, skip: skip}).populate('user').sort({created: -1}).exec(function (err, product) {
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
	users.find({}).populate('order').populate('order.product.info').populate('order.user').where('order._id').exists().sort({created: -1}).exec(function (err, user) {
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
			res.status(200).jsonp({'orders': _.sortBy(sortedInfo, 'created'), 'count': sortedInfo.length});
		} else {
			res.status(404).jsonp({message: 'No order has been found'});
		}
	});
}

module.exports.carts = function (req, res) {
	users.find({}).populate('cart').populate('cart.product.info').populate('cart.user').where('cart._id').sort({created: -1}).exists().exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			var usercarts = user,
			sortedInfo = [];
			//Get the user cart info
			usercarts.forEach(function (userInfo) {
				var cartInfo = userInfo.cart;
				cartInfo.forEach(function (cart) {
					sortedInfo.push({
						user: {
							_id: userInfo._id,
							name: userInfo.name
						},
						cart: cart
					});
				});
			});
			res.status(200).jsonp({'carts': sortedInfo, 'count': sortedInfo.length});
		} else {
			res.status(404).jsonp({message: 'No cart has been found'});
		}
	});
}

module.exports.messages = function (req, res) {
	contacts.find({}).sort({date: -1}).exec(function (err, contact) {
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
	products.find({}, 'comment').where('comment._id').exists().populate('comment').sort({created: -1}).exec(function (err, user) {
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
	products.find({}, 'heart').where('heart._id').exists().populate('heart').sort({created: -1}).exec(function (err, user) {
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

module.exports.usersAnalysis = function (req, res) {
	var dataDates;
	var userDateInput = dateInput(req.params.dateFrom, req.dateTo, function (result) {
		dataDates = result;
	});

	users.find({"created": {"$gte": dataDates.from, "$lt": dataDates.to}, "role": "user"}).exec(function (err, user) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			lineChart(dataDates.from, dataDates.to, user, null, function (err, result) {
				if(err){
					res.status(500).jsonp(err);
				} else {
					res.status(200).jsonp(result);
				}
			});
		}
	});
}

module.exports.orderAnalysis = function (req, res) {
	var dataDates;
	var userDateInput = dateInput(req.params.dateFrom, req.dateTo, function (result) {
		dataDates = result;
	});

	users.find({"order.created": {"$gte": dataDates.from, "$lt": dataDates.to}}, 'order').populate('order.product.info').populate('order.user').where('order._id').exists().sort('created').exec(function (err, user) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			if(user.length > 0){
				users.populate(user, {path: 'order.product.info.user', model: 'user'}, function (err, userInfo) {
					lineChart(dataDates.from, dataDates.to, userInfo[0].order, null, function (err, result) {
						if(err){
							res.status(500).jsonp(err);
						} else {
							res.status(200).jsonp(result);
						}
					});
				});
			} else {
				lineChart(dataDates.from, dataDates.to, [], null, function (err, result) {
					if(err){
						res.status(500).jsonp(err);
					} else {
						res.status(200).jsonp(result);
					}
				});
			}
		}
	});
}

module.exports.cartAnalysis = function (req, res) {
	var dataDates;
	var userDateInput = dateInput(req.params.dateFrom, req.dateTo, function (result) {
		dataDates = result;
	});

	users.find({"cart.created": {"$gte": dataDates.from, "$lt": dataDates.to}, "role": "user"}).populate('user').populate('cart.product').where('cart._id').exists().sort('created').exec(function (err, user) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			lineChart(dataDates.from, dataDates.to, user, 'cart', function (err, result) {
				if(err){
					res.status(500).jsonp(err);
				} else {
					res.status(200).jsonp(result);
				}
			});
		}
	});
}

module.exports.commentAnalysis = function (req, res) {
	var dataDates;
	var userDateInput = dateInput(req.params.dateFrom, req.dateTo, function (result) {
		dataDates = result;
	});

	products.find({"comment.created": {"$gte": dataDates.from, "$lt": dataDates.to}}).populate('user').populate('comment.author').where('comment._id').exists().sort('created').exec(function (err, product) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			lineChart(dataDates.from, dataDates.to, product, 'comment', function (err, result) {
				if(err){
					res.status(200).jsonp(err);
				} else {
					res.status(200).jsonp(result);
				}
			});
		}
	});
}

module.exports.heartAnalysis = function (req, res) {
	var dataDates;
	var userDateInput = dateInput(req.params.dateFrom, req.dateTo, function (result) {
		dataDates = result;
	});

	products.find({"heart.created": {"$gte": dataDates.from, "$lt": dataDates.to}}).populate('user').populate('heart.user').where('heart._id').exists().sort('created').exec(function (err, product) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			lineChart(dataDates.from, dataDates.to, product, 'heart', function (err, result) {
				if(err){
					res.status(200).jsonp(err);
				} else {
					res.status(200).jsonp(result);
				}				
			});
		}
	});
}

module.exports.productAnalysis = function (req, res) {
	var dataDates;
	var userDateInput = dateInput(req.params.dateFrom, req.dateTo, function (result) {
		dataDates = result;
	});

	products.find({"created": {"$gte": dataDates.from, "$lt": dataDates.to}}).populate('user').sort('created').exec(function (err, product) {
		if(err){
			res.status(500).jsonp(err);
		} else {
			lineChart(dataDates.from, dataDates.to, product, null, function (err, result) {
				if(err){
					res.status(200).jsonp(err);
				} else {
					res.status(200).jsonp(result);
				}	
			});
		}
	});
}

//this return full analysis of all users interaction
module.exports.usersInDepthAnalysis = function (req, res) {
	function userOrders(callback){
		users.find({"role": "user"}, function (err, user) {
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
				userHasComment = [],
				userHasHeart = [],
				productHasComments = [],
				productHasCommentsCount = 0,
				productHasHearts = [],
				productHasHeartsCount = 0;

				productInfo.forEach(function (info) {
					productsCount++;

					if(info.heart.length > 0){
						productHasHearts.push(info.heart);
						productHasHearts.forEach(function (heart) {
							if(userHasHeart.indexOf(heart[0].user[0].toString()) == -1){
								userHasHeart.push(heart[0].user[0].toString());
							}
						});	
					}

					if(info.comment.length > 0){
						productHasComments.push(info.comment);
						productHasComments.forEach(function (comment) {
							if(userHasComment.indexOf(comment[0].author[0].toString()) == -1){
								userHasComment.push(comment[0].author[0].toString());
							}
						});					
					}

					if(info.user.length > 0){
						if(userHasProduct.indexOf(info.user[0].toString()) == -1){
							userHasProduct.push(info.user[0].toString());
						}
					}
				});


				callback(null,
				{
					"productsCount": productsCount,
					"hasProduct": userHasProduct,
					"hasProductCount": userHasProduct.length,
					"userHasComment": userHasComment,
					"userHasCommentCount": userHasComment.length,
					"userHasHeart": userHasHeart,
					"userHasHeartCount": userHasHeart.length,
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
			"userHasComment": result[1].userHasComment,
			"userHasCommentCount": result[1].userHasCommentCount,
			"userHasHeart": result[1].userHasHeart,
			"userHasHeartCount": result[1].userHasHeartCount,
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


module.exports.category = function (req, res) {
	category.find({}, function (err, result) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(result);
		}
	});
}

module.exports.addCategory = function (req, res) {
	var newCatName = req.body.category.name;
	var catParentName = req.body.category.parent;

	category.find({}, function(err, result){
		if(err){
			res.status(500).jsonp({message: err});
		} else {
			isValidParentCategory(result, newCatName, catParentName, function(err, check){
				if(err){
					res.status(500).jsonp({message: err});
				} else {
					var newCategory = new category(req.body.category);
					newCategory.save(function (err, result) {
						if(err){
							res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
						} else {

							res.status(200).jsonp(result);
						}
					});
				}
			});
		}
	});
}

module.exports.updateCategory = function (req, res) {
	if(req.body.category){
		//make sure that update names of category and it parents does not match
		if(req.body.category.name != req.body.category.parent){
			category.find({}, function (err, result) {
				if(err){
					res.status(500).jsonp({message: err});
				} else {
					var newCatName = req.body.category.name;
					var catParentName = req.body.category.parent;
					//check is this a valid category
					isValidParentCategory(result, newCatName, catParentName, function(err, check){
						if(err){
							res.status(500).jsonp({message: err});
						} else {
							//get the category id
							var catId = _.findIndex(result,  function(item){
								return item._id == req.params.id;
							});
							//save the old category info
							var oldValue = JSON.parse(JSON.stringify(result[catId]));
							//add data to the category (user input)
							var cat = _.extend(result[catId], req.body.category);

							cat.save(function(err, newCategory){
								if(err){
									res.status(500).jsonp({message: err});
								} else {
									//update the category parent name in the whole DB
									console.log(result[catId].name);
									console.log(oldValue.name);
									category.update({parent: oldValue.name}, {parent: result[catId].name}, {multi: true},function(err, updateResult){
										if(err){
											res.status(500).jsonp({message: err});
										} else {
											res.status(200).jsonp(newCategory);
										}
									});	
								}
							});
						}
					});
				}
			});
		} else {
			res.status(500).jsonp({message: 'Parent category can not include itself'});
		}
	} else {
		res.status(500).jsonp({message: 'No information has been provided'});
	}
}

module.exports.removeCategory = function (req, res) {
	category.find({_id: req.params.id}).remove().exec(function (err, result) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp('Category has been removed successfully');
		}
	});
}