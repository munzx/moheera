'use strict';

angular.module('adminModule').controller('productsAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 5;

	$scope.skipProducts = 0;
	$scope.products = [];

	$scope.addMore = function () {
		connectAdminFactory.get({page: 'products', "limit": limit, "skip": $scope.products.length}, function (response) {
			if(response.products.length > 0){
				console.log(response.products.length);
				for(var i=0; i < response.products.length; i++){
					$scope.products.push(response.products[i]);
				}
			}
			$scope.skipProducts = $scope.products;
		});
	}
}]);