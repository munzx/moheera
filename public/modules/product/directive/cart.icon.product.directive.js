'use strict';

angular.module('productModule').directive('cartIconProductDirective', ['connectCartFactory', 'registerUserConfigFactory', 'requreLoginConfigFactory', function (connectCartFactory, registerUserConfigFactory, requreLoginConfigFactory) {
	return {
		restrict: 'A',
		templateUrl: 'public/modules/product/view/cart.icon.product.view.html',
		replace: true,
		transclude: true,
		scope: {
			product: '=cartIconProductDirective'
		},
		link: function (scope, elem, attrs) {
			scope.user = registerUserConfigFactory.getUser();
			scope.$watch('product', function (value) {
				var getStatus = function () {
					if(value && scope.user){
						if(scope.user.cart.length > 0){
							var carts = scope.user.cart;
							for(var i=0;i <= carts.length;i++){
								if(carts[i]){
									if(carts[i].product == value._id){
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

			scope.addToCart = function (product) {
				if(scope.isChecked == false && product.quantity >= 1){
					connectCartFactory.save({productId: product._id, product: product}, function (response) {
						scope.user.cart = response.cart;
						registerUserConfigFactory.setUser(scope.user);
						scope.isChecked = true;
					}, function (err) {
						if(err.status == 403){
							requreLoginConfigFactory.open('cart');
						}
					});
				} else {
					connectCartFactory.remove({productId: product._id}, function (response) {
						scope.user.cart = response.cart;
						registerUserConfigFactory.setUser(scope.user);	
						scope.isChecked = false;
					});
				}
			}
		}
	}
}]);