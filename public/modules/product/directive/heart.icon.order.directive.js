'use strict';

angular.module('productModule').directive('heartIconProductDirective', ['registerUserConfigFactory', 'connectHeartProductFactory', 'requreLoginConfigFactory', function (registerUserConfigFactory, connectHeartProductFactory, requreLoginConfigFactory) {
	return {
		restrict: 'A',
		templateUrl: 'public/modules/product/view/heart.icon.product.view.html',
		replace: true,
		transclude: true,
		scope: {
			product: '=heartIconProductDirective'
		},
		link: function (scope, elem, attrs) {
			var user = registerUserConfigFactory.getUser();
			scope.$watch('product', function (value) {
				var getStatus = function () {
					if(value){
						if(value.heart.length > 0){
							var hearts = value.heart;
							//to access the heart 'owner' id embedded in the product retrieved from moheera api
							//product.heart[array].user[0]._id
							for(var i=0;i <= hearts.length;i++){
								if(hearts[i]){
									if(hearts[i].user == user._id){
										return true;
									}
								}
							}
						}
						return false;
					} else {
						return false;
					}
				}
				//update the 'isChecked' value
				scope.isChecked = getStatus();
			});

			//heart or unheart a prodcut
			//for some reason the product $watch above is not updating the
			// 'isChecked' variable so we do it manually
			scope.heartProduct = function (productId) {
				if(scope.isChecked == false){
					connectHeartProductFactory.save({productId: productId}, function (response) {
						scope.product.heart = response.heart;
						scope.isChecked = true;
					}, function (err) {
						if(err.status == 403){
							requreLoginConfigFactory.open('heart');
						}
					});
				} else {
					connectHeartProductFactory.remove({productId: productId}, function (response) {
						scope.product.heart = response.heart;
						scope.isChecked = false;
					});
				}
			}

		}
	}
}]);