'use strict';

angular.module('productModule').factory('connectProductFactory', ['$resource', function ($resource) {
	return $resource('/api/v1/product/:userName/:action/:id/:getByName/:categoryName',
			{
				id: "@_id",
				action: "@action",
				categoryName: "@categoryName",
				getByName: "@getByName",
				userName: "@userName"
			},
			{
				"update": {
					method:"PUT"
				},
				"save": {
					method:"POST"
				}
			}
		);
}]);