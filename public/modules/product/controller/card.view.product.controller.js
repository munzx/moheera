'use strict';

angular.module('productModule').controller('cardViewProductController', ['$scope', 'registerUserConfigFactory', function ($scope, registerUserConfigFactory) {
	var user = registerUserConfigFactory.getUser();

	$scope.logo = function (logo) {
		if(logo){
			return 'public/uploads/' + logo;
		} else {
			return 'public/modules/config/img/user.png';
		}
	}

	$scope.userLink = function (name) {
		if(user){
			if(user.name == name){
				return 'profile';
			} else {
				return name;
			}
		} else {
			return name;
		}
	}

	$scope.userProductLink = function (value) {
		if(user){
			if(user.name == value){
				return 'profile/product';
			} else {
				return value;
			}
		} else {
			return value;
		}
	}

}]);