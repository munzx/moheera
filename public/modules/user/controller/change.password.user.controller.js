'use strict';

angular.module('userModule').controller('changePasswordUserController', ['$scope', '$location', 'connectUserFactory', function ($scope, $location, connectUserFactory) {
	//Update user password
	$scope.changeUserPassword = function () {
		//Make sure no success or error messages are showed
		$scope.success = false;
		$scope.error = false;


		// userInfo is inherted from the profile controller , this is due to the fact
		// that this conntroller is child controller of the profile controller , this is
		// done through the ui-router
		connectUserFactory.update({action: "password"}, $scope.userInfo, function (response) {
			$scope.success = true;
			//remove the $dirty state from the form so when we empty
			//thr form we dont get error messages
			$scope.changePasswordForm.$setPristine();
			//empty form fields
			$scope.userInfo.newPassword = '';
			$scope.userInfo.currentPassword = '';
			$scope.userInfo.verifyPassword = '';
		}, function (error) {
			$scope.error = error.data.message;
		});
	}

	$scope.$watch('userInfo.verifyPassword', function (value) {
		if($scope.userInfo.newPassword == $scope.userInfo.verifyPassword) {
			$scope.changePasswordForm.verifyPassword.$setValidity("match", true);
		} else {
			$scope.changePasswordForm.verifyPassword.$setValidity("match", false);
		}
	});

}]);