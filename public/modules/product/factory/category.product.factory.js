'use strict';

angular.module('productModule').factory('categoryProductFactory', [function () {
	return ['men', 'women', 'kid', 'art', 'book', 'bokhoor', 'perfume', 'accessory'];
}]);