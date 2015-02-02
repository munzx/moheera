'use strict';

angular.module('userModule').factory('connectCommentProductFactory', ['$resource', function ($resource) {
	return $resource('product/:id/comment/:commentId',
			{
				id: "@id",
				commentId: "@commentId"
			}
		)
}]);