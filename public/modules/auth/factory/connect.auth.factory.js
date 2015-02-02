'use strict';

angular.module('authModule').factory('connectAuthFactory', ['$resource', function ($resource) {
		return $resource('/user/:id');
}]);