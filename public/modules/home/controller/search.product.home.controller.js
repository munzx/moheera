'use strict';

angular.module('homeModule').controller('searchProductHomeController', ['$scope', 'connectSearchHomeFactory', '$stateParams', 'registerUserConfigFactory',function ($scope, connectSearchHomeFactory, $stateParams, registerUserConfigFactory) {
	$scope.user = registerUserConfigFactory.getUser();

	connectSearchHomeFactory.get({target: 'product' ,name: $stateParams.name}, function (response) {
		$scope.result = response.result;
	});

	$scope.getUserPage = function (value) {
		if($scope.user){
			if(value == $scope.user.name){
				return 'profile/product';
			} else {
				console.log(value);
				return value;
			}
		} else {
			return value;
		}
	}
}]);