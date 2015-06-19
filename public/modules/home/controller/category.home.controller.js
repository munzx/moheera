'use strict';

angular.module('homeModule').controller('categoryHomeController', ['$scope', 'connectProductFactory', '$stateParams', 'registerUserConfigFactory',function ($scope, connectProductFactory, $stateParams, registerUserConfigFactory) {
	$scope.userInfo = registerUserConfigFactory.getUser();

	$scope.getByCountry = function () {
		connectProductFactory.query({action: 'category', getByName: $stateParams.name, countryName: $scope.country}, function (response) {
			$scope.result = response;
			console.log($scope.country);
		});
	}

	connectProductFactory.query({action: 'category', getByName: $stateParams.name}, function (response) {
		$scope.result = response;
		$scope.categoryBanner = 'public/modules/home/img/category/banner/' + $stateParams.name + '.jpg';
	});
}]);