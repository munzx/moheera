'use strict';

angular.module('adminModule').controller('usersAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 40;
		
	$scope.skipUsers = 0;
	$scope.allUsers = [];

	$scope.addMoreUsers = function () {
		moheera.busy = true;
		connectAdminFactory.get({page: 'users', "limit": limit, "skip": $scope.skipUsers}, function (response) {
			if(response.users.length > 0){
				for(var i=0; i < response.users.length; i++){
					$scope.allUsers.push(response.users[i]);
				}
			}
			moheera.busy = false;
		});
		$scope.skipUsers+= limit;
	}


}]);