'use strict';

angular.module('adminModule').controller('reportsAdminController', ['$scope', 'connectAdminFactory', '$timeout', function ($scope, connectAdminFactory, $timeout) {

	connectAdminFactory.get({page: 'comments'}, function (response) {
		$scope.commentsCount = response.count;
	});

	connectAdminFactory.get({page: 'hearts'}, function (response) {
		$scope.heartsCount = response.count;
	});

	connectAdminFactory.get({page: 'users', action: 'analysis'}, function (response) {
		$scope.polarLabels = ["User has orders", "User has products", "Number of Users", "User with no product or order"];
		$scope.polarData = [response.hasOrderCount, response.hasProductCount, response.usersCount, response.hasNoProductOrOrderCount];
	});

	connectAdminFactory.query({page: 'hearts', action: 'analysis'}, function (response) {
		var result = response,
		date,
		sortedInfo = [];

		result.forEach(function (info) {
			info.heart.forEach(function (heart) {
				date = new Date(heart.created);
				sortedInfo.push({
					"day": date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate(),
					"month": date.getMonth().toString().length == 1 ? '0' + date.getMonth() : date.getMonth(),
					"year": date.getFullYear()
				});
			});
		});

		$scope.heartsAnalysis = sortedInfo;
	});

	connectAdminFactory.query({page: 'comments', action: 'analysis'}, function (response) {
		var result = response,
		date,
		sortedInfo = [];

		result.forEach(function (info) {
			info.comment.forEach(function (comment) {
				date = new Date(comment.created);
				sortedInfo.push({
					"day": date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate(),
					"month": date.getMonth().toString().length == 1 ? '0' + date.getMonth() : date.getMonth(),
					"year": date.getFullYear()
				});
			});
		});

		$scope.commentsAnalysis = sortedInfo;
	});

	connectAdminFactory.query({page: 'products', action: 'analysis'}, function (response) {
		var result = response,
		date,
		sortedInfo = [];

		result.forEach(function (product) {
			date = new Date(product.created);
			sortedInfo.push({
				"day": date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate(),
				"month": date.getMonth().toString().length == 1 ? '0' + date.getMonth() : date.getMonth(),
				"year": date.getFullYear()
			});
		});

		$scope.productsAnalysis = sortedInfo;
	});

	connectAdminFactory.query({page: 'orders', action: 'analysis'}, function (response) {
		var result = response,
		date,
		sortedInfo = [];

		result.forEach(function (info) {
			info.order.forEach(function (order) {
				date = new Date(order.created);
				sortedInfo.push({
					"day": date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate(),
					"month": date.getMonth().toString().length == 1 ? '0' + date.getMonth() : date.getMonth(),
					"year": date.getFullYear()
				});
			});
		});

		$scope.ordersAnalysis = sortedInfo;
	});

	connectAdminFactory.query({page: 'carts', action: 'analysis'}, function (response) {
		var result = response,
		date,
		sortedInfo = [];

		result.forEach(function (info) {
			info.cart.forEach(function (cart) {
				date = new Date(cart.created);
				sortedInfo.push({
					"day": date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate(),
					"month": date.getMonth().toString().length == 1 ? '0' + date.getMonth() : date.getMonth(),
					"year": date.getFullYear()
				});
			});
		});

		$scope.cartsAnalysis = sortedInfo;
	});


	$scope.viewType = function (value) {
		if(!value){
			$scope.lineData = [
				[65, 59, 80, 81, 56, 55, 40],
				$scope.productsAnalysis.month,
				$scope.commentsAnalysis.month,
				$scope.heartsAnalysis.month,
				$scope.ordersAnalysis.month,
				$scope.cartsAnalysis.month
			];
		}
	}


	$scope.lineLabels = ["January", "February", "March", "April", "May", "June", "July"];
	$scope.lineSeries = ['Users', 'Products', 'Comments', 'Hearts', 'Orders', 'Cart'];
	$scope.lineData = [
	[65, 59, 80, 81, 56, 55, 40],
	[28, 48, 40, 19, 86, 27, 90],
	[50, 90, 30, 49, 46, 57, 60],
	[78, 68, 90, 49, 86, 97, 20],
	[98, 48, 90, 69, 76, 57, 40],
	[98, 48, 90, 69, 76, 57, 40]
	];
	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};

}]);