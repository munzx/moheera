'use strict';

//Dependencies
var mongoose = require('mongoose'),
	errorHandler = require('./error'),
	_ = require('lodash'),
	users = require('../models/user'),
	products = require('../models/product');

module.exports.index = function(req, res){
	users.find({name: req.params.userName}, function (err, userInfo) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(userInfo){
			if(userInfo.length > 0){
				products.find({user: userInfo[0]._id}).sort({created: "desc"}).exec(function(err, product){
					if(err){
						res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
					} else if(product) {
						res.status(200).jsonp({product: product, user: userInfo});
					} else {
						res.status(404).json({message: 'No product has been found'});
					}
				});
			} else {
				res.status(404).jsonp({message: 'User not found'});
			}
		} else {
			res.status(404).jsonp({message: 'User not found'});
		}
	});
}

module.exports.create = function(req, res){
	//get the images
	var image1 = req.files.image1,
		image2 = req.files.image2,
		image3 = req.files.image3,
		image4 = req.files.image4;

	var formData = new products(req.body);

	if(!_.isEmpty(req.files)){
		//if the user had another image then remove it before adding the new one
		if(!_.isEmpty(image1)){
			//get the new file name
			formData.image1 = image1.name;
		}
		//if the user had another image then remove it before adding the new one
		if(!_.isEmpty(image2)){
			//get the new file name
			formData.image2 = image2.name;
		}
		//if the user had another image then remove it before adding the new one
		if(!_.isEmpty(image3)){
			//get the new file name
			formData.image3 = image3.name;
		}
		//if the user had another image then remove it before adding the new one
		if(!_.isEmpty(image4)){
			//get the new file name
			formData.image4 = image4.name;
		}
	}

	if(image1 && image2 && image3 && image4){
		if(!image1.truncated && !image2.truncated && !image3.truncated && !image4.truncated){
			formData.name = req.body.name;
			formData.price = req.body.price;
			formData.quantity = req.body.quantity;
			formData.desc = req.body.desc;
			formData.user = req.user;
			formData.userName = req.user.name;
			formData.userMobilePhone = req.user.mobilePhone;
			formData.firstName = req.user.firstName;
			formData.lastName = req.user.lastName;
			formData.email = req.user.email;

			formData.save(function(err, product){
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else {
					res.status(200).jsonp(product);
				}
			});
		} else {
			res.status(400).jsonp({message: 'Please upload images of max size of 1MB for every image'});
		}
	} else {
		res.status(400).jsonp({message: 'Please upload four images of the product'});
	}
}

module.exports.getByName = function(req, res){
	products.findOne({name: req.params.name}, function(err, product){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product) {
			res.status(200).jsonp(product);
		} else {
			res.status(404).json({message: 'Product has not been found'});
		}
	});
}

//update only if the product creator has the same logged in user id which mean they are the same person
module.exports.update = function(req, res){
	//get the images
	var image1 = req.files.image1,
		image2 = req.files.image2,
		image3 = req.files.image3,
		image4 = req.files.image4,
		imageUploadError = false;

	var formData = {};

	if(!_.isEmpty(req.files)){
		//if the user had another image then remove it before adding the new one
		if(!_.isEmpty(image1)){
			if(image1.truncated){
				imageUploadError = true;
			} else {
				//get the new file name
				formData.image1 = image1.name;
			}
		}
		//if the user had another image then remove it before adding the new one
		if(!_.isEmpty(image2)){
			if(image2.truncated){
				imageUploadError = true;
			} else {
				//get the new file name
				formData.image2 = image2.name;
			}
		}
		//if the user had another image then remove it before adding the new one
		if(!_.isEmpty(image3)){
			if(image3.truncated){
				imageUploadError = true;
			} else {
				//get the new file name
				formData.image3 = image3.name;
			}
		}
		//if the user had another image then remove it before adding the new one
		if(!_.isEmpty(image4)){
			if(image4.truncated){
				imageUploadError = true;
			} else {
				//get the new file name
				formData.image4 = image4.name;
			}
		}
	}

	if(imageUploadError){
		res.status(400).jsonp({message: 'Please upload images of max size of 1MB for every image'});
	} else {
		formData.name = req.body.name;
		formData.price = req.body.price;
		formData.quantity = req.body.quantity;
		formData.desc = req.body.desc;
		formData.category = req.body.category;

		products.findOneAndUpdate({_id: req.params.id, user: req.user._id}, formData, function(err, product, numOfAffectedRows){
			if(err){
				fs.unlink('./public/uploads/' + req.user.image1); // delete the partially written file
				fs.unlink('./public/uploads/' + req.user.image2); // delete the partially written file
				fs.unlink('./public/uploads/' + req.user.image3); // delete the partially written file
				fs.unlink('./public/uploads/' + req.user.image4); // delete the partially written file

				res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
			} else if(product){
				res.status(200).jsonp(product);
			} else {
				res.status(200).json({message: 'Failed to update document'});
			}
		});
	}
}

//delete only if the product creator has the same logged in user id which mean they are the same person
module.exports.delete = function(req, res){
	products.findOneAndRemove({_id: req.params.id, user: req.user._id}, function(err, numOfAffectedRows){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(numOfAffectedRows === 0){
			res.status(200).json({message: 'Failed to delete document'});
		} else {
			users.update({}, {$pull: {"cart": {'productId': req.params.id}}}, {multi: true, upsert: false}, function (err, user) {
				if(err){
					console.log(err);
				} else {
					console.log(user);
				}
			});
			users.findById(req.user._id, function (err, user) {
				res.status(200).json(user);
			});
		}
	});
}

module.exports.categoryName = function(req, res){
	products.find({category: req.params.category, userName: req.params.userName}, function(err, product){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			res.status(200).jsonp(product);
		} else {
			res.status(404).json({message: 'No product has been found'});
		}
	});
}

//Get all products categories of a certain user
module.exports.allUserCategory = function (req, res) {
	products.find({userName: req.params.userName}, function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			var allProduct = product;
			var cats = [];

			allProduct.forEach(function (item) {
				cats.push(item.category);
			});

			users.find({name: req.params.userName}, function (err, user) {
				if(user){
					res.status(200).jsonp({category: _.uniq(cats), user: user[0]});
				}
			});			
		} else {
			res.status(404).json({message: 'Unknown error has occured'});
		}
	});
}