'use strict';

angular.module('orderModule').factory('connectOrderFactory', ['$resource', function ($resource) {
	return $resource('/api/v1/product/order/:id',
			{
				id: "@id",
				name: "@name"
			},
			{
				update: {
					method: "PUT"
				}
			}
		);
}]);