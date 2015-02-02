'use strict';

angular.module('productModule').factory('categoryProductFactory', [function () {
	return ['men', 'women', 'kid', 'gift', 'book'];
}]);