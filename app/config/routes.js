'use strict';

//Dependencies
var users = require('../controllers/user'),
	product = require('../controllers/product'),
	order = require('../controllers/order'),
	comment = require('../controllers/comment'),
	heart = require('../controllers/heart'),
	cart = require('../controllers/cart'),
	passport = require('passport'),
	authLocal = require('./auth/local.strategy');

module.exports = function (app) {
	//Assign variable to rename the PASSPORT local authentication strategy
	var Auth = passport.authenticate('local');
	//check if the user is authinticated
	function ensureAuthenticated(req, res, next){
		if(req.isAuthenticated()){
			next();
		} else {
			res.status(403).json('Access Denied');
		}
	}

	//check if the user role is admin
	function isAdmin(req, res, next){
		if(req.user.role === 'admin'){
			next();
		} else {
			res.status(403).json('Access Denied');
		}
	}

	//check if the user role is user
	//grant the admin an access to any of the user route/controller
	function isUser(req, res, next){
		if(req.user.role === 'user' || req.user.role === 'admin'){
			next();
		} else {
			res.status(403).json('Access Denied');
		}
	}

	//Check is the user is a gues i.e not "logged in"
	function isGuest (req, res, next) {
		if(req.isAuthenticated()){
			res.status(403).jsonp('You are already signed in , please sign out before signing up!');
		} else {
			next();
		}
	}

	//Index page
	app.get('/', function(req, res){
		res.render('../public/modules/config/view/index', {
			isAuthenticated: req.isAuthenticated(),
			userInfo: req.user
		});
	});

	//Serve login page
	app.get('/login', function(req, res){
		res.render('../public/modules/auth/view/login', {
			isAuthenticated: req.isAuthenticated(),
			user: req.user
		});
	});

	//Check login credentials
	app.post('/login', Auth, function(req, res){
		res.status(200).json(req.user);
	});

	//Logout
	app.get('/logout', function(req, res){
		req.logout();
		res.status(200).json('logged out');
	});

	//check if user is logged in
	app.get('/check', isUser, function(req, res){
		res.status(200).json('logged in');
	});

	//Users
	app.get('/user', users.index); //get all users
	app.post('/user', isGuest, users.create); //create a new user
	app.put('/user', ensureAuthenticated, isUser, users.update); //update user info
	app.put('/user/password', ensureAuthenticated, isUser, users.changePassword); //update the user password
	app.delete('/user', ensureAuthenticated, isUser, users.delete); //delete user
	app.get('/user/:name', users.getByName); //get a user by name

	//Carts
	app.put('/user/cart', ensureAuthenticated, isUser, cart.updateProduct); //update user cart (only quantity)
	app.get('/user/cart/products', ensureAuthenticated, isUser, cart.index); //get all products in the user cart
	app.post('/user/cart/:productId', ensureAuthenticated, isUser, cart.addProduct); //add a product to the user cart
	app.delete('/user/cart/:productId', ensureAuthenticated, isUser, cart.removeProduct); //remove a product from the user cart

	//Orders
	app.get('/product/order', ensureAuthenticated, isUser, order.index); //get all orders of a certain user
	app.get('/product/:id/order/:orderId', ensureAuthenticated, isUser, order.getById); // get a product order by id
	app.post('/product/order', ensureAuthenticated, isUser, order.create); //create a new product order
	app.put('/product/:id/order/:orderId', ensureAuthenticated, isUser, order.update); //update a product order
	app.delete('/product/:id/order/:orderId', ensureAuthenticated, isUser, order.delete); //delete a product order

	//Products
	app.get('/product/all/:userName', product.index); //get all products of a certain user by user name
	app.post('/product', ensureAuthenticated, isUser, product.create); //create a new product
	app.put('/product/:id', ensureAuthenticated, isUser, product.update); //update a product by id
	app.delete('/product/:id', ensureAuthenticated, isUser, product.delete); //delete a product by id
	app.get('/product/:name', product.getByName); //get a product by name
	app.get('/product/:userName/category', product.allUserCategory); //find all categories of products to a certian user
	app.get('/product/:userName/category/:category', product.categoryName); //find products by category name for a certain user

	//Comments
	app.get('/product/:id/comment', comment.index); //get all comments of a product
	app.post('/product/:id/comment', ensureAuthenticated, isUser, comment.create); //add a new comment
	app.delete('/product/:id/comment/:commentId', ensureAuthenticated, isUser, comment.delete); //delete a comment

	//Hearts
	app.get('/product/:id/heart', heart.index); //get all hearts of a product
	app.post('/product/:id/heart', ensureAuthenticated, isUser, heart.create); // heart a certain product
	app.delete('/product/:id/heart', ensureAuthenticated, isUser, heart.delete); //Un-heart a product! the heart id is included so admin can remove it as well

	//404 Route/Page has not been found
	app.use(function (req, res) {
		res.render('../public/modules/config/view/index', {
			isAuthenticated: req.isAuthenticated(),
			userInfo: req.user
		});
	});
}
