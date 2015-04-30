'use strict';

angular.module('adminModule').controller('indexAdminController', ['$scope', 'registerUserConfigFactory', '$location', 'connectAdminFactory', function ($scope, registerUserConfigFactory, $location, connectAdminFactory) {
	$scope.userInfo = registerUserConfigFactory.getUser();

	//if the user is not registered or not an admin then go to the home page
	if(!$scope.userInfo || $scope.userInfo.role != 'admin') $location.path('/');

	connectAdminFactory.get({page: 'users'}, function (response) {
		$scope.usersCount = response.count;
	});

	connectAdminFactory.get({page: 'products'}, function (response) {
		$scope.productsCount = response.count;
	});

	connectAdminFactory.get({page: 'orders'}, function (response) {
		$scope.ordersCount = response.count;
	});

	$scope.lineLabels = ["January", "February", "March", "April", "May", "June", "July"];
	$scope.lineSeries = ['Sales', 'Comments', 'Hearts', 'Orders', 'Products', 'Users'];
	$scope.lineData = [
	[65, 59, 80, 81, 56, 55, 40],
	[28, 48, 40, 19, 86, 27, 90],
	[50, 90, 30, 49, 46, 57, 60],
	[78, 68, 90, 49, 86, 97, 20],
	[98, 48, 90, 69, 76, 57, 40]
	];
	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};

}]);