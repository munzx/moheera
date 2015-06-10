'use strict';

angular.module('adminModule').controller('productsAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 20;

	$scope.skipProducts = 0;
	$scope.products = [];

	$scope.addMoreProducts = function () {
		if($scope.busy == false){
			$scope.busy = true;
			connectAdminFactory.get({page: 'products', "limit": limit, "skip": $scope.skipProducts}, function (response) {
				if(response.products.length > 0){
					for(var i=0; i < response.products.length; i++){
						$scope.products.push(response.products[i]);
					}
				}
				$scope.busy = false;
			});
		}
		$scope.skipProducts+= limit;
	}

}]);