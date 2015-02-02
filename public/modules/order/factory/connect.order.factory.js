'use strict';

angular.module('orderModule').factory('connectOrderFactory', ['$resource', function ($resource) {
	return $resource('/product/:productId/order/:id/:name',
			{
				productId: "@productId",
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