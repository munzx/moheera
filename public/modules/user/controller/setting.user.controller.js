'use strict';

angular.module('userModule').controller('settingUserController', ['$scope', '$location', 'connectUserFactory', 'registerUserConfigFactory', '$state', function ($scope, $location, connectUserFactory, registerUserConfigFactory, $state) {
	var user = registerUserConfigFactory.getUser();
	$scope.userInfo = angular.copy(user);
	//hide loading image
	$scope.loading = false;

	$scope.removeAccount = function () {
		$location.path('/profile/remove');
	}

	$scope.updateAccount = function () {
		//show loading image
		$scope.loading = true;
		connectUserFactory.update($scope.userInfo, function (response) {
			$scope.loading = false;
			$scope.success = true;
			user.banner = response.banner;
			user.logo = response.logo;
		}, function (error) {
			$scope.loading = false;
			$scope.error = error.data.message;
		});
	}

}]);