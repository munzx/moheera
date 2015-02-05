'use strict';

angular.module('userModule').factory('connectUserFactory', ['$resource', function ($resource) {
	return $resource('/api/v1/user/:action/:byUserName',
		{
			name: "@byUserName",
			action: "@action"
		},
		{
			"update": {
				method:"PUT",
				withCredentials: true,
				headers: {'Content-Type': undefined },
				transformRequest: angular.identity
			}
		});
}]);