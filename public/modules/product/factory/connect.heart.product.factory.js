'use strict';

angular.module('productModule').factory('connectHeartProductFactory', ['$resource', function ($resource) {
	return $resource('product/:productId/heart/:heartId', 
			{
				productId: '@productId',
				heartId: '@heartId'
			}
		);
}]);