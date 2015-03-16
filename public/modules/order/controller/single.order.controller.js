'use strict';

angular.module('orderModule').controller('singleOrderController', ['$scope', '$location', 'connectOrderFactory', '$stateParams', 'statusOrderFactory', 'registerUserConfigFactory', function ($scope, $location, connectOrderFactory, $stateParams, statusOrderFactory, registerUserConfigFactory) {
	$scope.user = registerUserConfigFactory.getUser();
	$scope.statusOptions = statusOrderFactory.status;

	connectOrderFactory.get({id: $stateParams.id}, function (response) {
		$scope.orderInfo = response.order;
		$scope.owner = response.owner;
		//get the current status and save as old so we can get it if the status
		//got updateed
		$scope.oldStatus = angular.copy(response.order.status);
	}, function (err) {
		$scope.error = err.data.message;
	});


	$scope.updateOrder = function () {
		var updateInfo = {
			status: $scope.orderInfo.status,
			statusHistory: {
				oldStatus: $scope.oldStatus,
				updateRemarks: $scope.updateRemarks
			}
		}
		connectOrderFactory.update({id: $stateParams.id}, updateInfo, function (response) {
			$scope.updateRemarks = '';
			$scope.success = response;
			$scope.error = false;
			$scope.orderInfo = response.order;
			$scope.oldStatus = angular.copy(response.order.status);
		}, function (err) {
			$scope.error = err.data.message;
			$scope.success = false;
		});
	}

}]);