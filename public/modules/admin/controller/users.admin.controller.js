'use strict';

angular.module('adminModule').controller('usersAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 20,
		skip = 0;

	function getUsers(){
		connectAdminFactory.get({page: "users", "limit": limit, "skip": skip}, function (response) {
			$scope.users = response.users;
			skip = limit + skip;
		});
	}

	//initiate the get users function
	getUsers();
}]);