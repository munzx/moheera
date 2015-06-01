'use strict';

angular.module('adminModule').controller('productsAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 4;

	$scope.skipProducts = 0;
	$scope.products = [];

	var count=0;

	$scope.addMore = function () {
		connectAdminFactory.get({page: 'products', "limit": limit, "skip": $scope.skipProducts}, function (response) {
			$scope.skipProducts+= limit;
			if(response.products.length > 0){
				count++;
				console.log(count);
				for(var i=0; i < response.products.length; i++){
					$scope.products.push(response.products[i]);
				}
			}
		});
	}

	$scope.addMore();
}]);