'use strict';

angular.module('adminModule').controller('ordersAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	connectAdminFactory.get({page: 'orders'}, function (response) {
		$scope.orders = response.orders;
		if($scope.orders.length > 0){
			$scope.showOrders = true;
			$scope.noOrders = false;
			$scope.showOrderDetails = false;
		} else {
			$scope.noOrders = true;
		}
	});

	$scope.getOrderDetails = function (index) {
		$scope.orderDetails = $scope.orders[index];
		$scope.showOrders = false;
		$scope.noOrders = false;
		$scope.showOrderDetails = true;
	}

	$scope.back = function (index) {
		$scope.showOrders = true;
		$scope.noOrders = false;
		$scope.showOrderDetails = false;
	}

}]);