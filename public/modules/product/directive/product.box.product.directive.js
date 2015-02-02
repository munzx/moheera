'use strict';

angular.module('productModule').directive('productBoxProductDirective', ['registerUserConfigFactory', '$stateParams', '$state', function (registerUserConfigFactory, $stateParams, $state) {
	return {
		restrict: 'A',
		templateUrl: 'public/modules/product/view/product.box.product.view.html',
		replace: true,
		transclude: true,
		scope: {
			product: '=productBoxProductDirective'
		},
		link: function (scope, elem, attrs) {
			var user = registerUserConfigFactory.getUser();
			scope.$watch('product', function (value) {
				if(value){
					//intial values
					//the image to be viewed link
					scope.viewImageLink = 'public/uploads/' + value.image1;
					//highlight the image viewed
					scope.highlightImage = 1;
					if(user._id == value.user){
						scope.productLink = '/profile/product/' + value.name;
					} else {
						scope.productLink = '/' + value.userName + '/' + value.name;
					}

					//show the image that been clicked and highlight it
					scope.viewImage = function (image) {
						switch(image){
							case '1':
							scope.viewImageLink = 'public/uploads/' + value.image1;
							scope.highlightImage = 1;
							break;
							case '2':
							scope.viewImageLink = 'public/uploads/' + value.image2;
							scope.highlightImage = 2;
							break;
							case '3':
							scope.viewImageLink = 'public/uploads/' + value.image3;
							scope.highlightImage = 3;
							break;
							case '4':
							scope.viewImageLink = 'public/uploads/' + value.image4;
							scope.highlightImage = 4;
							break;
							default:
							scope.viewImageLink = 'public/uploads/' + value.image1;
							scope.highlightImage = 1;
						}
					}
				}

			});
		}
	}
}]);