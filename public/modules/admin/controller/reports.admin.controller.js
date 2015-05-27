'use strict';

angular.module('adminModule').controller('reportsAdminController', ['$q', '$scope', 'connectAdminFactory', '$timeout', function ($q, $scope, connectAdminFactory, $timeout) {

	connectAdminFactory.get({page: 'comments'}, function (response) {
		$scope.commentsCount = response.count;
	});

	connectAdminFactory.get({page: 'hearts'}, function (response) {
		$scope.heartsCount = response.count;
	});

	connectAdminFactory.get({page: 'users', action: 'indepthanalysis'}, function (response) {
		$scope.polarLabels = ["User has orders", "User has products", "Number of Users", "User with no product or order"];
		$scope.polarData = [response.hasOrderCount, response.hasProductCount, response.usersCount, response.hasNoProductOrOrderCount];
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

	$scope.getAnalysisButtton = function () {
		getAnalysis($scope.dateFrom);
	}

	$scope.onClick = function (points, evt) {
		console.log($scope.lineData);
	};

}]);