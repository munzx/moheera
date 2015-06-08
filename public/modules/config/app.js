'use strict';

// intitiate the app and Inject all of the app module dependencies
//configure the routes
var moheera = angular.module('moheera', ['ngAnimate', 'infinite-scroll', 'adminModule', 'angulartics', 'angulartics.google.analytics', 'ui.bootstrap', 'ui.router','ngResource', 'authModule', 'homeModule', 'userModule', 'productModule', 'orderModule', 'cartModule', 'chart.js']);

//RouteScopes & Routes Configurations 
moheera.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', 'ChartJsProvider', function ($urlRouterProvider, $stateProvider, $locationProvider, ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
    	colours: ['#FF5252', '#FF8A80'],
    	responsive: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
    	datasetFill: false,
    	skipLabels: true
    });
	$urlRouterProvider.otherwise('notfound');
	$stateProvider
		.state('notfound',{
			url: '/notfound',
			templateUrl: 'public/modules/config/view/notfound.config.view.html',
			controller: 'errorConfigController',
			cache: true
		})
		.state('home', {
			url: '/',
			templateUrl: 'public/modules/home/view/index.home.view.html',
			controller: 'indexHomeController',
			cache: true
		})
		.state('image', {
			url: '/service/image',
			templateUrl: 'public/modules/home/view/image.home.view.html',
			controller: 'imageHomeController',
			cache: true
		})
		.state('search', {
			url: '/search',
			templateUrl: 'public/modules/home/view/search.home.view.html',
			controller: 'searchHomeController',
			cache: true
		})
		.state('admin', {
			url: '/admin',
			templateUrl: 'public/modules/admin/view/index.admin.view.html',
			controller: 'indexAdminController',
			cache: true
		})
		.state('admin.users', {
			url: '/users',
			templateUrl: 'public/modules/admin/view/users.admin.view.html',
			controller: 'usersAdminController',
			cache: true
		})
		.state('admin.messages', {
			url: '/messages',
			templateUrl: 'public/modules/admin/view/messages.admin.view.html',
			controller: 'messagessAdminController',
			cache: true
		})
		.state('admin.products', {
			url: '/products',
			templateUrl: 'public/modules/admin/view/products.admin.view.html',
			controller: 'productsAdminController',
			cache: true
		})
		.state('admin.orders', {
			url: '/orders',
			templateUrl: 'public/modules/admin/view/orders.admin.view.html',
			controller: 'ordersAdminController',
			cache: true
		})		
		.state('search.user', {
			url: '/user/:name',
			templateUrl: 'public/modules/home/view/search.user.home.view.html',
			controller: 'searchUserHomeController',
			cache: true
		})
		.state('search.product', {
			url: '/product/:name',
			templateUrl: 'public/modules/home/view/search.product.home.view.html',
			controller: 'searchProductHomeController',
			cache: true
		})
		.state('category', {
			url: '/category/:name',
			templateUrl: 'public/modules/home/view/category.home.view.html',
			controller: 'categoryHomeController',
			cache: true
		})
		.state('contact', {
			url: '/contact',
			templateUrl: 'public/modules/home/view/contact.home.view.html',
			controller: 'indexHomeController',
			cache: true
		})
		.state('about', {
			url: '/about',
			templateUrl: 'public/modules/home/view/about.home.view.html',
			controller: 'indexHomeController',
			cache: true
		})
		.state('whyMoheera', {
			url: '/why_moheera',
			templateUrl: 'public/modules/home/view/why.moheera.home.view.html',
			controller: 'indexHomeController',
			cache: true
		})
		.state('signin', {
			url: '/signin',
			templateUrl: 'public/modules/auth/view/signin.auth.view.html',
			controller: 'signinAuthController',
			cache: true
		})
		.state('signup', {
			url: '/signup',
			templateUrl: 'public/modules/auth/view/signup.auth.view.html',
			controller: 'signupAuthController',
			cache: true
		})
		.state('providerSignIn', {
			url: '/signin/provider/:id',
			templateUrl: 'public/modules/auth/view/provider.signin.auth.view.html',
			controller: 'signInProviderAuthController',
			cache: true
		})
		.state('signout', {
			url: '/signout',
			controller: 'signoutAuthController',
			cache: true
		})
		.state('profile', {
			url: '/profile',
			templateUrl: 'public/modules/user/view/profile.user.view.html',
			controller: 'profileUserControlller',
			cache: true
		})
		.state('profile.category', {
			url: '/product/category/:category',
			templateUrl: 'public/modules/user/view/category.user.view.html',
			controller: 'categoryUserController'
		})
		.state('profile.remove', {
			url: '/remove',
			templateUrl: 'public/modules/user/view/remove.account.user.view.html',
			controller: 'removeAccountUserController',
			cache: true
		})
		.state('profile.setting', {
			url:'/setting',
			templateUrl: 'public/modules/user/view/setting.user.view.html',
			controller: 'settingUserController',
			cache: true
		})
		.state('profile.social', {
			url: '/profile/social',
			templateUrl: 'public/modules/user/view/social.user.view.html',
			controller: 'socialUserControlller',
			cache: true
		})
		.state('profile.userPassword', {
			url: '/account/password',
			templateUrl: 'public/modules/user/view/change.password.user.view.html',
			controller: 'changePasswordUserController',
			cache: true
		})
		.state('profile.orderDone', {
			url: '/order/done',
			templateUrl: 'public/modules/order/view/done.order.view.html',
			controller: 'allOrderController',
			cache: true
		})
		.state('profile.orderCreate', {
			url: '/order/create',
			templateUrl: 'public/modules/order/view/create.order.view.html',
			controller: 'createOrderController',
			cache: true
		})
		.state('profile.singleOrder', {
			url: '/product/:productId/order/:id/',
			templateUrl: 'public/modules/order/view/single.order.view.html',
			controller: 'singleOrderController',
			cache: true
		})
		.state('profile.order', {
			url: '/order',
			templateUrl: 'public/modules/order/view/all.order.view.html',
			controller: 'allOrderController',
			cache: true
		})
		.state('profile.addProduct', {
			url: '/product/add',
			templateUrl: 'public/modules/product/view/add.product.view.html',
			controller: 'addProductController',
			cache: true
		})
		.state('profile.editProduct', {
			url: '/product/:name/edit',
			templateUrl: 'public/modules/product/view/edit.product.view.html',
			controller: 'editProductController',
			cache: true
		})
		.state('profile.singleProduct', {
			url: '/product/:name',
			templateUrl: 'public/modules/product/view/single.product.view.html',
			controller: 'singleProductController',
			cache: true
		})
		.state('profile.cart', {
			url: '/cart',
			templateUrl: 'public/modules/cart/view/all.cart.view.html',
			controller: 'allCartController',
			cache: true
		})
		.state('user', {
			url: '/:userName',
			templateUrl: 'public/modules/user/view/other.user.view.html',
			controller: 'otherUserControlller',
			cache: true
		})
		.state('user.singleProduct', {
			url: '/:productName',
			templateUrl: 'public/modules/product/view/other.single.product.view.html',
			controller: 'otherSingleProductControlller',
			cache: true
		})
		.state('user.category', {
			url: '/product/category/:category',
			templateUrl: 'public/modules/user/view/other.category.user.view.html',
			controller: 'categoryUserController',
			cache: true
		});
		$locationProvider.html5Mode(true).hashPrefix('!');
}])
.run(['$rootScope', '$location', function ($rootScope, $location) {
	//remove the extra sympoles that is inserted by facebook redirect "when facebook redirect to the success login pagein server side"
	//when  a user try to sign up through facebook
	if ($location.hash() === '_=_'){
		$location.hash(null);
	}

	$rootScope.$on('$stateChangeSuccess', function() {
	   document.body.scrollTop = document.documentElement.scrollTop = 20;
	});

	//add a query to the page
	if(window.query){
		//redirect the user to the needed page
		if(window.query.page){
			$location.path(window.query.page);
		}
		//add query to the site url so it can be read by the concerned page
		$location.search(query.key, query.value);
	}

	$rootScope.logged = false;
	$rootScope.lastPage = '';
}]);