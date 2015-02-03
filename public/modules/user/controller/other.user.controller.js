'use strict';

angular.module('userModule').controller('otherUserControlller', ['registerUserConfigFactory', 'connectProductFactory', '$location', '$scope', '$stateParams', function (registerUserConfigFactory, connectProductFactory, $location, $scope, $stateParams) {
	var user = registerUserConfigFactory.getUser();


	connectProductFactory.get({action: 'all', getByName: $stateParams.userName}, function (respone) {
		$scope.userProducts = respone.product;
		$scope.userInfo = respone.user[0];

		//if user is trying to view his/her page then redirect to the user profile page
		if($scope.userInfo._id === user._id){
			$location.path('/profile');
		}

		$scope.banner = function () {
			if($scope.userInfo.banner){
				return 'public/uploads/' + userInfo.banner;
			} else {
				return 'public/modules/config/img/banner.jpg';
			}
		}

		$scope.logo = function () {
			if($scope.userInfo.logo){
				return 'public/uploads/' + userInfo.logo;
			} else {
				return 'public/modules/config/img/user.png';
			}
		}

	}, function (err) {
		$location.path('/notfound');
	});



}]);