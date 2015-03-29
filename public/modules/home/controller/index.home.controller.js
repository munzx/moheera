'user strict';

angular.module('homeModule').controller('indexHomeController', ['registerUserConfigFactory', 'connectContactHomeFactory', '$location', '$scope', function (registerUserConfigFactory, connectContactHomeFactory, $location, $scope) {
	$scope.user = registerUserConfigFactory.getUser();

	$scope.contactFormDepartments = function () {
		return [
			'Marketing & Sales',
			'I.T',
			'Customer Service'
		];
	}

	$scope.contactFormReasons = function () {
		return [
			'Suggestion',
			'Inquery',
			'Complaint'
		];
	}

	$scope.contactSendMessage = function () {
		connectContactHomeFactory.save($scope.contact, function (response) {
			$scope.messageSent = true;
			$scope.error = false;
		}, function (error) {
			$scope.messageSent = false;
			$scope.error = error;
		});
	}


}]);