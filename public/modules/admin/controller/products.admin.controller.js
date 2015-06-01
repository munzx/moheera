'use strict';

angular.module('adminModule').controller('productsAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 40;

	$scope.skipProducts = 0;
	$scope.products = [];

	$scope.addMoreProducts = function () {
		moheera.busy = true;
		connectAdminFactory.get({page: 'products', "limit": limit, "skip": $scope.skipProducts}, function (response) {
			if(response.products.length > 0){
				for(var i=0; i < response.products.length; i++){
					$scope.products.push(response.products[i]);
				}
			}
			moheera.busy = false;
		});
		$scope.skipProducts+= limit;
	}

}]);