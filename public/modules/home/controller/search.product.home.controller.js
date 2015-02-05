'use strict';

angular.module('homeModule').controller('searchProductHomeController', ['$scope', 'connectSearchHomeFactory', '$stateParams', function ($scope, connectSearchHomeFactory, $stateParams) {
	connectSearchHomeFactory.get({target: 'product' ,name: $stateParams.name}, function (response) {
		$scope.result = response.result;
		console.log($scope.result);
	});
}]);