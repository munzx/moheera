'use strict';

angular.module('adminModule').controller('productsAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 16;

	$scope.addMore = function () {
		connectAdminFactory.get({page: 'products', "limit": limit}, function (response) {
			$scope.products = response.products;
			limit++;
		});
	}

}]);