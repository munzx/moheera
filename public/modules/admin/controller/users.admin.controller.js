'use strict';

angular.module('adminModule').controller('usersAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {

	connectAdminFactory.get({page: 'users'}, function (response) {
		$scope.users = response.users;
		console.log(response.users);
	});

}]);