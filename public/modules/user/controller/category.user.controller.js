'use strict';

angular.module('userModule').controller('categoryUserController', ['connectProductFactory', '$stateParams', '$scope', 'registerUserConfigFactory', function (connectProductFactory, $stateParams, $scope, registerUserConfigFactory) {
	var user = registerUserConfigFactory.getUser();
	connectProductFactory.query({userName: $stateParams.userName || user.name, action: "category", categoryName: $stateParams.category}, function (respense) {
		$scope.productByCategory = respense;
	});
}]);