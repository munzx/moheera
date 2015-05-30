'use strict';

angular.module('adminModule').controller('usersAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 20;
		
	$scope.skip = 0;
	$scope.allUsers = [];

	$scope.addMoreUsers = function () {
		connectAdminFactory.get({page: 'users', "limit": limit, "skip": $scope.skip}, function (response) {
			if(response.users.length > 0){
				for(var i=1; i < response.users.length; i++){
					$scope.allUsers.push(response.users[i]);
				}
				$scope.skip += limit;
			}
		});
	}
}]);