'user strict';

angular.module('homeModule').controller('indexHomeController', ['registerUserConfigFactory', '$location', '$scope', function (registerUserConfigFactory, $location, $scope) {
	$scope.user = registerUserConfigFactory.getUser();
}]);