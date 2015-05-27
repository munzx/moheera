'use strict';

angular.module('adminModule').controller('indexAdminController', ['$q', '$scope', 'registerUserConfigFactory', '$location', 'connectAdminFactory', function ($q, $scope, registerUserConfigFactory, $location, connectAdminFactory) {
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

	function getAnalysis (dateFrom) {
		$q.all([
			connectAdminFactory.get({page: 'carts', action: 'analysis', param: dateFrom}).$promise,
			connectAdminFactory.get({page: 'orders', action: 'analysis', param: dateFrom}).$promise,
			connectAdminFactory.get({page: 'hearts', action: 'analysis', param: dateFrom}).$promise,
			connectAdminFactory.get({page: 'comments', action: 'analysis', param: dateFrom}).$promise,
			connectAdminFactory.get({page: 'products', action: 'analysis', param: dateFrom}).$promise,
			connectAdminFactory.get({page: 'users', action: 'analysis', param: dateFrom}).$promise
		]).then(function (result) {
			$scope.lineData = [
				result[0].dataPoints,
				result[1].dataPoints,
				result[2].dataPoints,
				result[3].dataPoints,
				result[4].dataPoints,
				result[5].dataPoints
			]
			$scope.lineLabels = result[0].fullDate;
		}, function (err) {
			console.log(err);
		});


		$scope.lineLabels = ["January", "February", "March", "April", "May", "June", "July"];
		$scope.lineSeries = ['Products', 'Comments', 'Hearts', 'Orders', 'Cart', 'Users'];
		$scope.lineData = [
			[],
			[],
			[],
			[],
			[],
			[]
		];
	}

	getAnalysis();

}]);