'use strict';

angular.module('userModule').controller('settingUserController', ['$scope', '$location', 'connectUserFactory', 'registerUserConfigFactory', '$state', function ($scope, $location, connectUserFactory, registerUserConfigFactory, $state) {
	var user = registerUserConfigFactory.getUser();
	$scope.userInfo = angular.copy(user);
	//hide loading image
	$scope.loading = false;

	$scope.removeAccount = function () {
		$location.path('/profile/remove');
	}

	//set the value for the banner
	if(userInfo.banner.length > 0){
		$scope.banner = "public/uploads/" + userInfo.banner;
	} else {
		$scope.banner = userInfo.banner;
	}

	if(userInfo.logo.length > 0){
		$scope.logo = "public/uploads/" + userInfo.logo;
	} else {
		$scope.logo = userInfo.logo;
	}

	$scope.previewImagePlaceHolder = function (image, placeholder) {
		if(image.length > 0){
			return image;
		} else {
			return "public/uploads/" + placeholder;
		}
	}

	$scope.updateAccount = function () {
		//show loading image
		$scope.loading = true;
		connectUserFactory.update($scope.userInfo, function (response) {
			$scope.loading = false;
			$scope.success = true;
			user.banner = response.banner;
			user.logo = response.logo;
			user.firstName = response.firstName;
			user.lastName = response.lastName;
			user.email = response.email;
			user.pageDesc = response.pageDesc;
			user.mobilePhone = response.mobilePhone;

		}, function (error) {
			$scope.loading = false;
			$scope.error = error.data.message;
		});
	}

}]);