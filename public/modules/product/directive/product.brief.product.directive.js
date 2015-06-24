'use strict';

angular.module('productModule').directive('productBriefProductDirective', ['registerUserConfigFactory', '$stateParams', '$state', function (registerUserConfigFactory, $stateParams, $state) {
	return {
		restrict: 'A',
		templateUrl: 'public/modules/product/view/product.brief.product.view.html',
		replace: true,
		transclude: true,
		scope: {
			item: '=productBriefProductDirective'
		},
		link: function (scope, elem, attrs) {
			var user = registerUserConfigFactory.getUser();
			scope.$watch('item', function (value) {
				if(value){
					scope.logo = function (logo) {
						if(logo){
							return 'public/uploads/' + logo;
						} else {
							return 'public/modules/config/img/user.png';
						}
					}

					scope.userLink = function (name) {
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

					scope.userProductLink = function (value) {
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
				}
			});
		}
	}
}]);