'use strict';

angular.module('adminModule').controller('productsAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 20;

	$scope.skip = 0;
	$scope.products = [];

	$scope.addMoreProducts = function () {
		connectAdminFactory.get({page: 'products', "limit": limit, "skip": $scope.skip}, function (response) {
			if(response.products.length > 0){
				for(var i=1; i < response.products.length; i++){
					$scope.products.push(response.products[i]);
				}
				$scope.skip+= limit;
			}
		});
	}

}]);