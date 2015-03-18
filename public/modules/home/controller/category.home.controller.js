'use strict';

angular.module('homeModule').controller('categoryHomeController', ['$scope', 'connectProductFactory', '$stateParams', 'registerUserConfigFactory',function ($scope, connectProductFactory, $stateParams, registerUserConfigFactory) {
	$scope.userInfo = registerUserConfigFactory.getUser();

	$scope.userLink = function (value) {
		if($scope.userInfo){
			if($scope.userInfo.name == value){
				return 'profile/product';
			} else {
				return value;
			}
		} else {
			return value;
		}
	}

	connectProductFactory.query({action: 'category', getByName: $stateParams.name}, function (response) {
		$scope.result = response;
		$scope.categoryBanner = 'public/modules/home/img/category/banner/' + $stateParams.name + '.jpg';
	});
}]);