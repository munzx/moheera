'use strict';

angular.module('adminModule').controller('reportsAdminController', ['$q', '$scope', 'connectAdminFactory', '$timeout', function ($q, $scope, connectAdminFactory, $timeout) {

	connectAdminFactory.get({page: 'comments'}, function (response) {
		$scope.commentsCount = response.count;
	});

	connectAdminFactory.get({page: 'hearts'}, function (response) {
		$scope.heartsCount = response.count;
	});

	connectAdminFactory.get({page: 'users', action: 'indepthanalysis'}, function (response) {
		console.log(response.userHasCommentCount);
		$scope.pieLabels = ["User has order", "User has product", "User has cart", "User has comment", "User has heart", "User with no product or order"];
		$scope.pieData = [response.hasOrderCount, response.hasProductCount, response.userHasCartCount, response.userHasCommentCount, response.userHasHeartCount, response.hasNoProductOrOrderCount];
	});

	function getLineChartAnalysis (dateFrom) {
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
			$scope.dateFrom = new Date($scope.lineLabels[0]);
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

	//initilize the line chart
	getLineChartAnalysis();

	$scope.getAnalysisButtton = function () {
		getLineChartAnalysis($scope.dateFrom);
	}

	$scope.onClick = function (points, evt) {
		console.log($scope.lineData);
	};

}]);