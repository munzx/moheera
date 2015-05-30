'use strict';

angular.module('adminModule').controller('usersAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 16;

	$scope.addMore = function () {
		connectAdminFactory.get({page: 'users', "limit": limit}, function (response) {
			$scope.users = response.users;
			limit++;
		});
	}

}]);