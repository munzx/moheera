'use strict';

angular.module('adminModule').controller('productsAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {

	connectAdminFactory.get({page: 'products'}, function (response) {
		$scope.products = response.products;
	});
	
}]);