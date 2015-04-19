'use strict';

angular.module('userModule').controller('removeAccountUserController', ['$scope', '$location', 'connectUserFactory', '$state', '$rootScope', function ($scope, $location, connectUserFactory, $state, $rootScope) {
	$scope.cancelRemove = function () {
		$location.path('/profile');
	}

	$scope.confirmRemove = function () {
		connectUserFactory.remove(function (response) {
			$state.go('home', {}, {reload: true});
		}, function (error) {
			$scope.error = error.data.message;
		});
	}
}]);