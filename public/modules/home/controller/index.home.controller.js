'user strict';

angular.module('homeModule').controller('indexHomeController', ['registerUserConfigFactory', '$location', '$scope', function (registerUserConfigFactory, $location, $scope) {
	$scope.user = registerUserConfigFactory.getUser();
	// If the user is registred redirect the user to the profile page
	if($scope.user) $location.path('/profile');

}]);