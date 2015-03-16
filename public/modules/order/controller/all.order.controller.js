'use stritc';

angular.module('orderModule').controller('allOrderController', ['$scope', '$location', 'registerUserConfigFactory', 'connectOrderFactory', '$state', 'statusOrderFactory', function ($scope, $location, registerUserConfigFactory, connectOrderFactory, $state, statusOrderFactory) {
	$scope.user = registerUserConfigFactory.getUser();
	$scope.statusOptions = statusOrderFactory.status;

	$scope.showStatus = function () {
		var order = {};
		return order.status = 'pending';
	}

	connectOrderFactory.query(function (response) {
		$scope.orderInfo = response;
	}, function (err) {
		$scope.error = err.data.message;
	});

	$scope.orderDetails = function (orderId) {
		//redirect to single order page
		$state.go('profile.singleOrder', {id: orderId}, {reload: true});
	}

}]);