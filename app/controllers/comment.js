'use strict';

//Dependencies
var mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('./error'),
	products = require('../models/product');


module.exports.index = function (req, res) {
	products.findById(req.params.id).populate('comment.author').exec(function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			var comment = product.comment;
			if(comment){
				res.status(200).jsonp(comment);
			} else {
				res.status(404).json({message: 'No comment has been found'});
			}
		} else {
			res.status(404).json({message: 'Product has not been found'});
		}
	});
}

module.exports.create = function (req, res) {
	products.findById(req.params.id).populate('comment.author').exec(function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			var comment = req.body;
			comment.author = req.user;
			product.comment.push(comment);
			product.save(function (err, newComment) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else if(newComment){
					res.status(200).jsonp(newComment.comment[newComment.comment.length-1]); //return last comment in the comment array
				} else {
					res.status(401).json({message: 'Failed to add comment'});
				}
			});
		} else {
			res.status(404).json({message: 'Product not found'});
		}
	});
}

//Assure only the comment owner can delete the comment
module.exports.delete = function (req, res) {
	products.findById(req.params.id).populate('comment.author').exec(function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			var userComments = product.comment;
			userComments.forEach(function (commentValue) {
				if(commentValue.author[0]._id == req.user.id){
					commentValue.remove();
				}
			});

			product.save(function (err) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else {
					res.status(200).jsonp('Comment has been deleted successfully');
				}
			});
		}
	});
}