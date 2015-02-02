'use strict';

// Depnedencies
var mongoose = require('mongoose'),
errorHandler = require('./error'),
fs = require('fs'),
_ = require('lodash'),
multer  = require('multer'),
users = require('../models/user');

// get all users
module.exports.index = function (req, res){
	users.find({password: 0}, function (err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			res.status(200).jsonp(user);
		} else {
			res.status(404).json({message: 'No user has been found'});
		}
	});
}

// create a new user
module.exports.create = function(req, res){
	var newUser = new users(req.body);
	newUser.save(function(err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(user);
		}
	});
}

// get user by name
module.exports.getByName = function (req, res){
	users.findOne({name: req.params.name}, {password: 0}, function(err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			res.status(200).jsonp(user);
		} else {
			res.status(404).json({message: 'User has not been found'});
		}
	});
}

//update user by id
module.exports.update = function(req, res){
	//Strange behaviour happnes if req.files used directly without
	//getting assigned to a variable first

	//check if any file has been sent
	var logoData = req.files.logo,
		bannerData = req.files.banner,
		imageUploadError = false;


	var formData = {};

	if(!_.isEmpty(req.files)){
		if(logoData){
			if(!logoData.truncated){
				//get the new file name
				formData.logo = logoData.name;
				//if the user had another logo then remove it before adding the new one
				if(_.isEmpty(req.user.logo) === false){
					fs.unlink('./public/uploads/' + req.user.logo); // delete the partially written file
				}
			} else {
				imageUploadError = true;
			}
		}
		if(bannerData){
			if(!bannerData.truncated){
				//get the new file name
				formData.banner = bannerData.name;
				//if the user had another logo then remove it before adding the new one
				if(_.isEmpty(req.user.banner) === false){
					fs.unlink('./public/uploads/' + req.user.banner); // delete the partially written file
				}
			} else {
				imageUploadError = true;
			}
		}
	}

	if(imageUploadError){
		res.status(400).jsonp({message: 'Please upload images of max size of 1MB'});
	} else {
		//form data without the files input fields (as the fields are empty , if we pass them they will override thier pairs in DB)
		formData.firstName = req.body.firstName;
		formData.lastName = req.body.lastName;
		formData.email = req.body.email;
		if(formData.pageDesc){formData.pageDesc = req.body.pageDesc};
		if(req.body.mobilePhone){ formData.mobilePhone = req.body.mobilePhone};

		users.findOneAndUpdate({_id: req.user._id}, formData, function(err, user, numOfAffectedRows){
			if(err){
				if(logoData){
					fs.unlink('./public/uploads/' + logoData.name); // delete the partially written file
				}
				if(bannerData){
					fs.unlink('./public/uploads/' + bannerData.name); // delete the partially written file
				}
				res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
			} else if(user) {
				req.files = false;
				res.status(200).jsonp(user);
			} else {
				res.status(404).json({message: 'User has not been found'});
			}
		});
	}
}

//update the user password
module.exports.changePassword = function(req, res){
	users.findOneAndUpdate({_id: req.user._id, password: req.body.currentPassword}, {"password": req.body.newPassword},function(err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			res.status(200).jsonp(user);
		} else {
			res.status(401).json({message: 'Current password is not correct'});
		}
	});
}

//delete user by id
module.exports.delete = function(req, res){
	users.findOneAndRemove({_id: req.user._id}, function(err, numOfAffectedRows){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(numOfAffectedRows === 0) {
			res.status(404).json({message: 'User has not been found'});
		} else {
			res.status(200).json({message: 'User has been deleted successfully'});
		}
	});
}