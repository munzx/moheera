'use strict';

angular.module('adminModule').factory('connectAdminFactory', ['$resource', function ($resource) {
	return $resource('api/v1/admin/:page/:action/:param');
}]);