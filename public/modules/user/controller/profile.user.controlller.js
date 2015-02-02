'use strict';

angular.module('userModule').controller('profileUserControlller', ['registerUserConfigFactory', 'connectProductFactory', '$location', '$scope', function (registerUserConfigFactory, connectProductFactory, $location, $scope) {
	$scope.userInfo = registerUserConfigFactory.getUser();

	//if user is not logged then redirect to the sign in page
	if(!$scope.userInfo) $location.path('/signin');

	$scope.banner = function () {
		if($scope.userInfo){
			if($scope.userInfo.banner.length){
				return 'public/uploads/' + $scope.userInfo.banner;
			} else {
				return 'public/modules/config/img/banner.jpg';
			}
		}
	}

	connectProductFactory.get({action: 'all', getByName: $scope.userInfo.name}, function (respone) {
		$scope.userProducts = respone.product;
	});

}]);