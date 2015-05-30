'use strict';

angular.module('adminModule').controller('productsAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 20,
		skip = 1;

	function getProducts () {
		connectAdminFactory.get({page: 'products', "limit": limit, "skip": skip}, function (response) {
			$scope.products = response.products;
			skip = limit + skip;
		});
	}
	
	getProducts();

}]);