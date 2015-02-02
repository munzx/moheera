'use strict';

angular.module('cartModule').factory('connectCartFactory', ['$resource', function ($resource) {
	return $resource('/user/cart/:productId/:action',
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