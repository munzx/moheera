'use strict';

angular.module('homeModule').controller('categoryHomeController', ['$scope', 'connectProductFactory', '$stateParams', 'registerUserConfigFactory',function ($scope, connectProductFactory, $stateParams, registerUserConfigFactory) {
	$scope.userInfo = registerUserConfigFactory.getUser();

	connectProductFactory.query({action: 'category', getByName: $stateParams.name}, function (response) {
		$scope.result = response;
		$scope.categoryBanner = 'public/modules/home/img/category/banner/' + $stateParams.name + '.jpg';
	});
}]);