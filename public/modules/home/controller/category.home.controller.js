'use strict';

angular.module('homeModule').controller('categoryHomeController', ['$scope', 'connectProductFactory', '$stateParams', 'registerUserConfigFactory',function ($scope, connectProductFactory, $stateParams, registerUserConfigFactory) {
	var limit = 25;
	$scope.skipProducts = 0;
	$scope.products = [];

	$scope.userInfo = registerUserConfigFactory.getUser();
	$scope.categoryBanner = 'public/modules/home/img/category/banner/' + $stateParams.name + '.jpg';

	$scope.getByCountry = function () {
		$scope.skipProducts = 0;
		connectProductFactory.query({action: 'category', getByName: $stateParams.name, countryName: $scope.country || 'null', "limit": limit, "skip": $scope.skipProducts}, function (response) {
			$scope.products = response;
			$scope.skipProducts = limit;
		});
	}

	$scope.addMoreProducts = function () {
		$scope.busy = true;
		connectProductFactory.query({action: 'category', getByName: $stateParams.name, countryName: $scope.country || 'null', "limit": limit, "skip": $scope.skipProducts}, function (response) {
			if(response.length > 0){
				$scope.allResult = $scope.allResult || angular.copy(response);
				for(var i=0; i < response.length; i++){
					$scope.products.push(response[i]);
				}
			}
		});
		$scope.skipProducts+= limit;
		$scope.busy = false;
		console.log($scope.skipProducts);
	}

}]);