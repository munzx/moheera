'use strict';

angular.module('adminModule').controller('messagessAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	connectAdminFactory.get({page: 'messages'}, function (response) {
		$scope.messages = response.messages;
		if($scope.messages.length > 0){
			$scope.msg = true;
			$scope.noMsg = true;
			$scope.showMsg = false;
		} else {
			$scope.msg = false;
			$scope.noMsg = false;
			$scope.showMsg = false;
		}
	});

	//hide messages details
	$scope.showMsgDetails = false;

	$scope.openMessage = function (index) {
		$scope.msg = false;
		$scope.noMsg = true;
		$scope.showMsg = true;
		$scope.showMsgDetails = $scope.messages[index];
	}

	$scope.back = function (index) {
		$scope.msg = true;
		$scope.noMsg = true;
		$scope.showMsg = false;
	}


}]);