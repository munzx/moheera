'use strict';

//Dependencies
var cms = require('../controllers/cms'),
	users = require('../controllers/user'),
	admin = require('../controllers/admin'),
	product = require('../controllers/product'),
	order = require('../controllers/order'),
	comment = require('../controllers/comment'),
	heart = require('../controllers/heart'),
	cart = require('../controllers/cart'),
	search = require('../controllers/search'),
	account = require('../controllers/account'),
	test = require('../controllers/test'),
	passport = require('passport'),
	authLocal = require('./auth/local.strategy'),
	facebook = require('./auth/facebook.strategy'),
	instagram = require('./auth/instagram.strategy'),
	twitter = require('./auth/twitter.strategy'),
	google = require('./auth/google.strategy');

module.exports = function (app, express) {
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

	//Facebook Login
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.get('/auth/facebook/callback', function (req, res, next) {
		passport.authenticate('facebook', function (err, account) {
			if(err){
				res.redirect('/');
			} else {
				if(req.user && account.user.length == 0){
					res.redirect('/api/v1/account/link/' + account._id);
				} else if(req.user && account.user.length > 0){
					res.render('../public/modules/config/view/index', {
						isAuthenticated: req.isAuthenticated(),
						userInfo: req.user,
						query: {page: '/profile/profile/social', key: 'error', value: 'account already linked'}
					});;
				} else if(!req.user && account.user.length > 0){
					req.login(account.user[0], function (err) {
						res.redirect('/');
					});
				} else {
					res.redirect('/provider/' + account._id);
				}
			}
		})(req, res, next);
	});

	//Instagram Login
	app.route('/auth/instagram').get(passport.authenticate('instagram'));
	app.get('/auth/instagram/callback', function (req, res, next) {
		passport.authenticate('instagram', function (err, account) {
			if(err){
				res.redirect('/');
			} else {
				if(req.user && account.user.length == 0){
					res.redirect('/api/v1/account/link/' + account._id);
				} else if(req.user && account.user.length > 0){
						re.render('../public/modules/config/view/index', {
							isAuthenticated: req.isAuthenticated(),
							userInfo: req.user,
							query: {page: '/profile/profile/social', key: 'error', value: 'account already linked'}
						});;
				} else if(!req.user && account.user.length > 0){
					req.login(account.user[0], function (err) {
						res.redirect('/');
					});
				} else {
					res.redirect('/provider/' + account._id);
				}
			}
		})(req, res, next);
	});

	//Twitter Login
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', function (req, res, next) {
		passport.authenticate('twitter', function (err, account) {
			if(err){
				res.redirect('/');
			} else {
				if(req.user && account.user.length == 0){
					res.redirect('/api/v1/account/link/' + account._id);
				} else if(req.user && account.user.length > 0){
					res.render('../public/modules/config/view/index', {
						isAuthenticated: req.isAuthenticated(),
						userInfo: req.user,
						query: {page: '/profile/profile/social', key: 'error', value: 'account already linked'}
					});;
				} else if(!req.user && account.user.length > 0){
					req.login(account.user[0], function (err) {
						res.redirect('/');
					});
				} else {
					res.redirect('/provider/' + account._id);
				}
			}
		})(req, res, next);
	});

	//Google Login
	app.route('/auth/google').get(passport.authenticate('google-openidconnect'));
	app.get('/auth/google/callback', function (req, res, next) {
		passport.authenticate('google-openidconnect', function (err, account) {
			if(err){
				res.redirect('/');
			} else {
				if(req.user && account.user.length == 0){
					res.redirect('/api/v1/account/link/' + account._id);
				} else if(req.user && account.user.length > 0){
					res.render('../public/modules/config/view/index', {
						isAuthenticated: req.isAuthenticated(),
						userInfo: req.user,
						query: {page: '/profile/profile/social', key: 'error', value: 'account already linked'}
					});;
				} else if(!req.user && account.user.length > 0){
					req.login(account.user[0], function (err) {
						res.redirect('/');
					});
				} else {
					res.redirect('/provider/' + account._id);
				}
			}
		})(req, res, next);
	});


	//check if the user role is admin
	function isAdmin(req, res, next){
		if(req.user){
			if(req.user.role === 'admin'){
				next();
			} else {
				res.status(403).json('Access Denied');
			}
		} else {
			res.status(403).json('Access Denied');
		}
	}

	//check if the user role is user
	//grant the admin an access to any of the user route/controller
	function isUser(req, res, next){
		if(req.user){
			if(req.user.role === 'user' || req.user.role === 'admin'){
				next();
			} else {
				res.status(403).json('Access Denied');
			}
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
			userInfo: req.user,
			query: {}
		});
	});

	//Check if the user info is complete
	app.get('/provider/:id', function(req, res){
		res.render('../public/modules/config/view/index', {
			isAuthenticated: req.isAuthenticated(),
			userInfo: req.user,
			query: {page: '/signin/provider/' + req.params.id}
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

	//set up routing to use version 1
	var v1 = express.Router();
	app.use('/api', v1);

	//register version and use it
	v1.use('/v1', express.Router()
		//test zone
		.get('/test', test.index)
		//Cms
		.get('/cms/contact', isAdmin, cms.contactIndex)
		.post('/cms/contact', isGuest, cms.contact)
		//Account (provider as twitter or facebook)
		.get('/account/:id', account.getById)
		.post('/account/:id', account.completeProviderProfile)
		.get('/account/status/:userID', account.AccountsStatus)
		.get('/account/link/:id', account.linkProviderAccount)
		//admin
		.get('/admin', isAdmin, admin.index)
		.get('/admin/first', admin.createFirst)
		.get('/admin/users/:limit?/:skip?', isAdmin, admin.users)
		.get('/admin/products/:limit?/:skip?', isAdmin, admin.products)
		.get('/admin/orders', isAdmin, admin.orders)
		.get('/admin/carts', isAdmin, admin.carts)
		.get('/admin/messages', isAdmin, admin.messages)
		.get('/admin/comments', isAdmin, admin.comments)
		.get('/admin/hearts/', isAdmin, admin.hearts)
		.get('/admin/analysis/indepthanalysis/:dateFrom*?', isAdmin, admin.usersInDepthAnalysis)
		.get('/admin/analysis/users/:dateFrom*?',isAdmin, admin.usersAnalysis)
		.get('/admin/analysis/orders/:dateFrom*?',isAdmin, admin.orderAnalysis)
		.get('/admin/analysis/carts/:dateFrom*?',isAdmin, admin.cartAnalysis)
		.get('/admin/analysis/products/:dateFrom*?',isAdmin, admin.productAnalysis)
		.get('/admin/analysis/comments/:dateFrom*?',isAdmin, admin.commentAnalysis)
		.get('/admin/analysis/hearts/:dateFrom*?',isAdmin, admin.heartAnalysis)
		//Users
		.get('/user', users.index) //get all users
		.post('/user', isGuest, users.create) //create a new user
		.put('/user', ensureAuthenticated, isUser, users.update) //update user info
		.put('/user/password', ensureAuthenticated, isUser, users.changePassword) //update the user password
		.delete('/user', ensureAuthenticated, isUser, users.delete) //delete user
		.get('/user/:name', isUser, users.getByName) //get a user by name
		//Carts
		.put('/user/cart/:productId', ensureAuthenticated, isUser, cart.updateProduct) //update user cart (only quantity)
		.get('/user/cart/products', ensureAuthenticated, isUser, cart.index) //get all products in the user cart
		.post('/user/cart/:productId', ensureAuthenticated, isUser, cart.addProduct) //add a product to the user cart
		.delete('/user/cart/:productId', ensureAuthenticated, isUser, cart.removeProduct) //remove a product from the user cart
		//Orders
		.get('/product/order', ensureAuthenticated, isUser, order.index) //get all orders of a certain user
		.get('/product/order/:orderId', ensureAuthenticated, isUser, order.getById) // get a product order by id
		.post('/product/order', ensureAuthenticated, isUser, order.create) //create a new product order
		.put('/product/order/:orderId', ensureAuthenticated, isUser, order.update) //update a product order
		.delete('/product/order/:orderId', ensureAuthenticated, isUser, order.delete) //delete a product order
		//Products
		.get('/product/all/:userName', product.index) //get all products of a certain user by user name
		.post('/product', ensureAuthenticated, isUser, product.create) //create a new product
		.put('/product/:id', ensureAuthenticated, isUser, product.update) //update a product by id
		.delete('/product/:id', ensureAuthenticated, isUser, product.delete) //delete a product by id
		.get('/product/:name', product.getByName) //get a product by name
		.get('/product/:userName/category', product.allUserCategory) //find all categories of products to a certian user
		.get('/product/:userName/category/:category', product.categoryName) //find products by category name for a certain user
		.get('/product/category/:name/:country*?', product.certainCategory)
		//Comments
		.get('/product/:id/comment', comment.index) //get all comments of a product
		.post('/product/:id/comment', ensureAuthenticated, isUser, comment.create) //add a new comment
		.delete('/product/:id/comment/:commentId', ensureAuthenticated, isUser, comment.delete) //delete a comment
		//Hearts
		.get('/product/:id/heart', heart.index) //get all hearts of a product
		.post('/product/:id/heart', ensureAuthenticated, isUser, heart.create) // heart a certain product
		.delete('/product/:id/heart', ensureAuthenticated, isUser, heart.delete) //Un-heart a product! the heart id is included so admin can remove it as well
		//Search
		.get('/search/user/:name', search.users)
		.get('/search/product/:name', search.products)
	);

	//404 Route/Page has not been found
	app.use(function (req, res) {
		res.render('../public/modules/config/view/index', {
			isAuthenticated: req.isAuthenticated(),
			userInfo: req.user,
			query: {}
		});
	});
}
