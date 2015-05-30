'use strict';

angular.module('adminModule').controller('usersAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 20,
		skip = 0;

	$scope.users = [];

	$scope.addMore = function () {
		connectAdminFactory.get({page: 'users', "limit": limit, "skip": skip}, function (response) {
			if(response.users.length > 0){
				for(var i=0; i < response.users.length; i++){
					$scope.users.push(response.users[i]);
				}
				$scope.skip+= limit;
			}
		});
	}
}]);