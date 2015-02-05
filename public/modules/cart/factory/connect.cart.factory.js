'use strict';

angular.module('cartModule').factory('connectCartFactory', ['$resource', function ($resource) {
	return $resource('/api/v1/user/cart/:productId/:action',
			{
				productId: '@productId',
				action: '@action'
			},
			{
				"update": {
					method: 'PUT',	
				}
			}
		)
}]);