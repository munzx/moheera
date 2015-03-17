'use strict';

//Dependencies
var mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('./error'),
	users = require('../models/user'),
	products = require('../models/product');


module.exports.users = function (req, res) {
	users.find({name: new RegExp(req.params.name, "i")}, {password: 0}, function (err, user) {
		if(err){
			res.status(401).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			res.status(200).jsonp({"result": user});
		} else {
			res.status(404).jsonp({message: 'No user has been found'});
		}
	});
}

module.exports.products = function (req, res) {
	products.find({name: new RegExp(req.params.name, "i")}).populate("user").exec(function (err, product) {
		if(err){
			res.status(401).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			res.status(200).jsonp({"result": product});
		} else {
			res.status(404).jsonp({message: 'No product has been found'});
		}
	});
}