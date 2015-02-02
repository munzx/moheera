'user strict';

angular.module('authModule').controller('signupAuthController', ['registerUserConfigFactory', '$scope', '$location', 'connectAuthFactory', function (registerUserConfigFactory, $scope, $location, connectAuthFactory) {
	if(registerUserConfigFactory.getUser()) $location.path('/profile');
	$scope.signUp = function () {
		connectAuthFactory.save($scope.credentials, function (data, res) {
			$location.path('/signin');
		},
		function (err) {
			$scope.error = err.data.message;
		});
	}

}]);