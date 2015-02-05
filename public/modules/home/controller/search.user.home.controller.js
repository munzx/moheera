'use strict';

angular.module('homeModule').controller('searchUserHomeController', ['$scope', 'connectSearchHomeFactory', '$stateParams', function ($scope, connectSearchHomeFactory, $stateParams) {
	connectSearchHomeFactory.get({target: 'user' ,name: $stateParams.name}, function (response) {
		$scope.result = response.result;
	});

	$scope.logo = function (logo) {
		if(logo.length){
			return 'public/uploads/' + logo;
		} else {
			return 'public/modules/config/img/user.png';
		}
	}
}]);