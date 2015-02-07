'use strict';

angular.module('homeModule').controller('categoryHomeController', ['$scope', 'connectProductFactory', '$stateParams', function ($scope, connectProductFactory, $stateParams) {
	connectProductFactory.query({action: 'category', getByName: $stateParams.name}, function (response) {
		$scope.result = response;

		if($scope.result.length){
			$scope.categoryBanner = 'public/modules/home/img/category/banner/' + $stateParams.name + '.jpg';
		}

	});
}]);