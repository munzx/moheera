'use strict';

angular.module('adminModule').controller('usersAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 20;
		
	$scope.skipUsers = 0;
	$scope.allUsers = [];

	$scope.addMoreUsers = function () {
		$scope.busy = true;
		connectAdminFactory.get({page: 'users', "limit": limit, "skip": $scope.skipUsers}, function (response) {
			if(response.users.length > 0){
				for(var i=0; i < response.users.length; i++){
					$scope.allUsers.push(response.users[i]);
				}
			}
			$scope.busy = false;
		});
		$scope.skipUsers+= limit;
	}


}]);