'use strict';

angular.module('productModule').factory('connectHeartProductFactory', ['$resource', function ($resource) {
	return $resource('/api/v1/product/:productId/heart/:heartId', 
			{
				productId: '@productId',
				heartId: '@heartId'
			}
		);
}]);