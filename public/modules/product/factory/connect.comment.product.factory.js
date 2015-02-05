'use strict';

angular.module('userModule').factory('connectCommentProductFactory', ['$resource', function ($resource) {
	return $resource('/api/v1/product/:id/comment/:commentId',
			{
				id: "@id",
				commentId: "@commentId"
			}
		)
}]);