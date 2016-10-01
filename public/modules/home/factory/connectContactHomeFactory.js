'user strict';

angular.module('moheera').factory('connectContactHomeFactory', ['$resource', function ($resource) {
	return $resource('/api/v1/cms/contact');
}]);