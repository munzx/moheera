'use strict';

angular.module('adminModule').controller('indexAdminController', ['$scope', 'registerUserConfigFactory', '$location', 'connectAdminFactory', function ($scope, registerUserConfigFactory, $location, connectAdminFactory) {
	$scope.userInfo = registerUserConfigFactory.getUser();

	//if the user is not registered or not an admin then go to the home page
	if(!$scope.userInfo || $scope.userInfo.role != 'admin') $location.path('/');


}]);