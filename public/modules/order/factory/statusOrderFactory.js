'user strict';

angular.module('orderModule').factory('statusOrderFactory', [function () {
	return {
			status: [
			'delivered',
			'pending',
			'processing',
			'canceled']
		}
}]);