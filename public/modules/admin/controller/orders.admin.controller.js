'use strict';

angular.module('adminModule').controller('ordersAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	connectAdminFactory.get({page: 'orders'}, function (response) {
		console.log(response);
	});
}]);