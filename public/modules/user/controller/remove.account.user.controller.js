'use strict';

angular.module('userModule').controller('removeAccountUserController', ['$scope', '$location', 'connectUserFactory', function ($scope, $location, connectUserFactory) {
	$scope.cancelRemove = function () {
		$location.path('/profile');
	}

	$scope.confirmRemove = function () {
		connectUserFactory.remove(function (response) {
			$location.path('/');
		}, function (error) {
			$scope.error = error.data.message;
		});
	}
}]);