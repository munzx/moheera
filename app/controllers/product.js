'use strict';

//Dependencies
var fs = require("fs"),
async = require("async"),
mongoose = require('mongoose'),
errorHandler = require('./error'),
_ = require('lodash'),
users = require('../models/user'),
products = require('../models/product');

module.exports.index = function(req, res){
	users.find({name: req.params.userName}).populate('user').exec(function (err, userInfo) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(userInfo){
			if(userInfo.length > 0){
				products.find({user: userInfo[0]._id}).sort({created: "desc"}).populate('user').exec(function(err, product){
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
	var base64Data = "",
	dest = 'public/uploads/';

	//A function to give unique name to each image file
	function getNewName (initial) {
		if(!initial){
			initial = 'name';
		}
		return initial + '.' + req.user.name + '.' + req.body.name + '.' + Math.floor(new Date() / 1000) + '.jpg'
	}

	//make unique names for image files
	var image1Name = getNewName('image1'),
	image2Name = getNewName('image2'),
	image3Name = getNewName('image3'),
	image4Name = getNewName('image4'),
	//get the images data
	image1 = req.body.image1,
	image2 = req.body.image2,
	image3 = req.body.image3,
	image4 = req.body.image4,
	//clean images of unnecessary data in order to make images out of the base64 data recieved
	imageData1 = image1.replace(/^data:image\/\w+;base64,/, ""),
	imageData2 = image2.replace(/^data:image\/\w+;base64,/, ""),
	imageData3 = image3.replace(/^data:image\/\w+;base64,/, ""),
	imageData4 = image4.replace(/^data:image\/\w+;base64,/, "");

	//create object to hold all of the recieved product data
	var formData = {};

	//write the images data to files
	function saveImage1 (callback) {
		fs.writeFile(dest + image1Name, imageData1, 'base64', function(err) {
			if(err){ image1Name = false; return callback(err); } else { formData.image1 = image1Name; callback(null); };
		});	
	}

	function saveImage2 (callback) {
		fs.writeFile(dest + image2Name, imageData2, 'base64', function(err) {
			if(err){ image2Name = false; return callback(err); } else { formData.image2 = image2Name; callback(null); };
		});	
	}

	function saveImage3 (callback) {
		fs.writeFile(dest + image3Name, imageData3, 'base64', function(err) {
			if(err){ image3Name = false; return callback(err); } else { formData.image3 = image3Name; callback(null); };
		});	
	}

	function saveImage4 (callback) {
		fs.writeFile(dest + image4Name, imageData4, 'base64', function(err) {
			if(err){ image4Name = false; return callback(err); } else { formData.image4 = image4Name; callback(null); };
		});	
	}

	//remove image files
	function removeImages () {
		if (fs.existsSync(dest + image1Name)) {fs.unlink(dest + image1Name)};
		if (fs.existsSync(dest + image2Name)) {fs.unlink(dest + image2Name)};
		if (fs.existsSync(dest + image3Name)) {fs.unlink(dest + image3Name)};
		if (fs.existsSync(dest + image4Name)) {fs.unlink(dest + image4Name)};
	}

	//if the images had been created successfully then proceed to enter the new product
	async.parallel([saveImage1, saveImage2, saveImage3, saveImage4], function (err) {
		if(err){
			//remove the images files
			removeImages();

			res.status(400).jsonp({message: 'Unkown error has occured, please upload 4 images again'});
		} else {
			if(formData.image1 && formData.image2 && formData.image3 && formData.image4){
				//the product info
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
				//enter the product
				var newProduct = new products(formData);
				newProduct.save(function(err, product){
					if(err){
						//remove the images files
						removeImages();
						res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
					} else {
						res.status(200).jsonp(product);
					}
				});
			} else {
				res.status(400).jsonp({message: 'Please upload four images of the product'});
			}
		}
	});
}

module.exports.getByName = function(req, res){
	products.findOne({name: req.params.name}).populate('comment.author').populate('user').exec(function(err, product){
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
	var base64Data = "",
	dest = 'public/uploads/',
	//create object to hold all of the recieved product data
	formData = {};

	//A function to give unique name to each image file
	function getNewName (initial) {
		if(!initial){
			initial = 'name';
		}
		if(!req.user.name || !req.body.name){
			return false;
		} else {
			return initial + '.' + req.user.name + '.' + req.body.name + '.' + Math.floor(new Date() / 1000) + '.jpg'
		}
	}

	//remove image files
	function removeImages () {
		if (fs.existsSync(dest + image1Name)) {fs.unlink(dest + image1Name)};
		if (fs.existsSync(dest + image2Name)) {fs.unlink(dest + image2Name)};
		if (fs.existsSync(dest + image3Name)) {fs.unlink(dest + image3Name)};
		if (fs.existsSync(dest + image4Name)) {fs.unlink(dest + image4Name)};
	}

	//get the images input data
	var	image1 = req.body.image1,
		image2 = req.body.image2,
		image3 = req.body.image3,
		image4 = req.body.image4,
		//set the new images name to be given to false
		image1Name = false,
		image2Name = false,
		image3Name = false,
		image4Name = false,
		//if images has been recieved than prepare them to be saved as base64 images
		imageData1 = (image1.length > 1000) ?  image1.replace(/^data:image\/\w+;base64,/, ""):false,
		imageData2 = (image2.length > 1000) ? image2.replace(/^data:image\/\w+;base64,/, ""):false,
		imageData3 = (image3.length > 1000) ? image3.replace(/^data:image\/\w+;base64,/, ""):false,
		imageData4 = (image4.length > 1000) ? image4.replace(/^data:image\/\w+;base64,/, ""):false;

	//write the images data to files
	function saveImage1 (callback) {
		//give the image a new unique name
		image1Name = getNewName('image1');
		//if the image got a name and has data then save the image
		//and set the formData.image1 value to the new unique name
		if(imageData1 && image1Name){
			fs.writeFile(dest + image1Name, imageData1, 'base64', function(err) {
				if(err){ callback('image1 is false'); } else { formData.image1 = image1Name; console.log('Bism Allah');callback(null);};
			});
		} else {
			callback(null);
		}
	}

	function saveImage2 (callback) {
		image2Name = getNewName('image2');
		if(imageData2 && image2Name){
			fs.writeFile(dest + image2Name, imageData2, 'base64', function(err) {
				if(err){ callback('image2 is false'); } else { formData.image2 = image2Name; callback(null); };
			});
		} else {
			callback(null);
		}
	}

	function saveImage3 (callback) {
		image3Name = getNewName('image3');
		if(imageData3 && image3Name){
			fs.writeFile(dest + image3Name, imageData3, 'base64', function(err) {
				if(err){ callback('image3 is false'); } else { formData.image3 = image3Name; callback(null); };
			});
		} else {
			callback(null);
		}
	}

	function saveImage4 (callback) {
		image4Name = getNewName('image4');
		if(imageData4 && image4Name){
			fs.writeFile(dest + image4Name, imageData4, 'base64', function(err) {
				if(err){callback('image4 is false'); } else { formData.image4 = image4Name; callback(null); };
			});
		} else {
			callback(null);
		}
	}

	async.parallel([saveImage1, saveImage2, saveImage3, saveImage4], function (err) {
		if(err){
			removeImages();
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			products.findOne({_id: req.params.id, user: req.user._id}, function(err, product){
				if(err){
					removeImages();
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else if(product){
					product.name = req.body.name;
					product.price = req.body.price;
					product.quantity = req.body.quantity;
					product.category = req.body.category;
					product.desc = req.body.desc;

					if(formData.image1){
						if (fs.existsSync(dest + product.image1)) {fs.unlink(dest + product.image1)};
						product.image1 = formData.image1;
					}

					if(formData.image2){
						if (fs.existsSync(dest + product.image2)) {fs.unlink(dest + product.image2)};
						product.image2 = formData.image2;
					}

					if(formData.image3){
						if (fs.existsSync(dest + product.image3)) {fs.unlink(dest + product.image3)};
						product.image3 = formData.image3;
					}

					if(formData.image4){
						if (fs.existsSync(dest + product.image4)) {fs.unlink(dest + product.image4)};
						product.image4 = formData.image4;
					}
					//save new info to the product
					product.save();
					res.status(200).jsonp(product);
				} else {
					res.status(200).json({message: 'Failed to update document'});
				}
			});
		}
	});
}

//delete only if the product creator has the same logged in user id which mean they are the same person
module.exports.delete = function(req, res){
	var dest = 'public/uploads/';
	products.findOne({_id: req.params.id, user: req.user._id}, function(err, product){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			product.remove();
			product.save();
			if (fs.existsSync(dest + product.image1)) {fs.unlink(dest + product.image1)};
			if (fs.existsSync(dest + product.image2)) {fs.unlink(dest + product.image2)};
			if (fs.existsSync(dest + product.image3)) {fs.unlink(dest + product.image3)};
			if (fs.existsSync(dest + product.image4)) {fs.unlink(dest + product.image4)};

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
		};
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

//get all products in a certain category
module.exports.certainCategory = function (req, res) {
	products.find({category: req.params.name}, function (err, product) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(product){
			res.status(200).jsonp(product);
		} else {
			res.status(404).jsonp({message: 'No products has been found'});
		}
	});
}