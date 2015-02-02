'use strict';

// intitiate the app and Inject all of the app module dependencies
//configure the routes
var moheera = angular.module('moheera', ['ui.bootstrap', 'ui.router','ngResource', 'authModule', 'homeModule', 'userModule', 'productModule', 'orderModule', 'cartModule']);

//RouteScopes & Routes Configurations 
moheera.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterProvider, $stateProvider, $locationProvider) {
	$urlRouterProvider.otherwise('notfound');
	$stateProvider
		.state('notfound',{
			url: '/notfound',
			templateUrl: 'public/modules/config/view/notfound.config.view.html',
			controller: 'errorConfigController'
		})
		.state('droppedIn', {
			url: '',
			templateUrl: 'public/modules/home/view/index.home.view.html',
			controller: 'indexHomeController'
		})
		.state('home', {
			url: '/',
			templateUrl: 'public/modules/home/view/index.home.view.html',
			controller: 'indexHomeController'
		})
		.state('contact', {
			url: '/contact',
			templateUrl: 'public/modules/home/view/contact.home.view.html',
			controller: 'indexHomeController'
		})
		.state('about', {
			url: '/about',
			templateUrl: 'public/modules/home/view/about.home.view.html',
			controller: 'indexHomeController'
		})
		.state('signin', {
			url: '/signin',
			templateUrl: 'public/modules/auth/view/signin.auth.view.html',
			controller: 'signinAuthController'
		})
		.state('signup', {
			url: '/signup',
			templateUrl: 'public/modules/auth/view/signup.auth.view.html',
			controller: 'signupAuthController'
		})
		.state('signout', {
			url: '/signout',
			controller: 'signoutAuthController'
		})
		.state('profile', {
			url: '/profile',
			templateUrl: 'public/modules/user/view/profile.user.view.html',
			controller: 'profileUserControlller'
		})
		.state('profile.category', {
			url: '/product/category/:category',
			templateUrl: 'public/modules/user/view/category.user.view.html',
			controller: 'categoryUserController'
		})
		.state('profile.remove', {
			url: '/remove',
			templateUrl: 'public/modules/user/view/remove.account.user.view.html',
			controller: 'removeAccountUserController'
		})
		.state('profile.setting', {
			url:'/setting',
			templateUrl: 'public/modules/user/view/setting.user.view.html',
			controller: 'settingUserController'
		})
		.state('profile.userPassword', {
			url: '/account/password',
			templateUrl: 'public/modules/user/view/change.password.user.view.html',
			controller: 'changePasswordUserController'
		})
		.state('profile.orderDone', {
			url: '/order/done',
			templateUrl: 'public/modules/order/view/done.order.view.html',
			controller: 'allOrderController'
		})
		.state('profile.orderCreate', {
			url: '/order/create',
			templateUrl: 'public/modules/order/view/create.order.view.html',
			controller: 'createOrderController'
		})
		.state('profile.singleOrder', {
			url: '/product/:productId/order/:id/',
			templateUrl: 'public/modules/order/view/single.order.view.html',
			controller: 'singleOrderController'
		})
		.state('profile.order', {
			url: '/order',
			templateUrl: 'public/modules/order/view/all.order.view.html',
			controller: 'allOrderController'
		})
		.state('profile.addProduct', {
			url: '/product/add',
			templateUrl: 'public/modules/product/view/add.product.view.html',
			controller: 'addProductController'
		})
		.state('profile.editProduct', {
			url: '/product/:name/edit',
			templateUrl: 'public/modules/product/view/edit.product.view.html',
			controller: 'editProductController'
		})
		.state('profile.singleProduct', {
			url: '/product/:name',
			templateUrl: 'public/modules/product/view/single.product.view.html',
			controller: 'singleProductController'
		})
		.state('profile.cart', {
			url: '/cart',
			templateUrl: 'public/modules/cart/view/all.cart.view.html',
			controller: 'allCartController'
		})
		.state('user', {
			url: '/:userName',
			templateUrl: 'public/modules/user/view/other.user.view.html',
			controller: 'otherUserControlller'
		})
		.state('user.singleProduct', {
			url: '/:productName',
			templateUrl: 'public/modules/product/view/other.single.product.view.html',
			controller: 'otherSingleProductControlller'
		})
		.state('user.category', {
			url: '/product/category/:category',
			templateUrl: 'public/modules/user/view/other.category.user.view.html',
			controller: 'categoryUserController'
		});
		$locationProvider.html5Mode(true).hashPrefix('!');
}])
.run(['$rootScope', function ($rootScope) {
	$rootScope.logged = false;
	$rootScope.lastPage = '';
}]);