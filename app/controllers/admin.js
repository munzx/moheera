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
accounts = require('../models/account');

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
	users.find({'role': 'user'}, 'order').populate('order').where('order._id').exists().exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			res.status(200).jsonp({'orders': user, 'count': user.length});
		} else {
			res.status(404).jsonp({message: 'No order has been found'});
		}
	});
}