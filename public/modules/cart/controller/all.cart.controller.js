'use strict';

angular.module('cartModule').controller('allCartController', ['$scope', '$location', 'connectCartFactory', '$state', 'registerUserConfigFactory', function ($scope, $location, connectCartFactory, $state, registerUserConfigFactory) {
	$scope.user = registerUserConfigFactory.getUser();
	connectCartFactory.query({action: 'products'}, function (response) {
		$scope.cart = response;
	});

	$scope.onePlusQuantity = function (index) {
		if($scope.cart[index].quantity < 20){
			$scope.cart[index].quantity++;
			connectCartFactory.update({product: $scope.cart[index]}, function (response) {
				$scope.error = false;
				$scope.user.cart = $scope.cart;
				registerUserConfigFactory.setUser($scope.user);
			}, function (err) {
				$scope.cart[index].quantity--;
				$scope.error = err.data.message;
			});
		}
	}

	$scope.oneMinusQuantity = function (index) {
		if($scope.cart[index].quantity >= 2){
			$scope.cart[index].quantity--;
			connectCartFactory.update({product: $scope.cart[index]}, function (response) {
				$scope.error = false;
				$scope.user.cart = $scope.cart;
				registerUserConfigFactory.setUser($scope.user);
			}, function (err) {
				$scope.cart[index].quantity++;
				$scope.error = err.data.message;
			});
		}
	}

	$scope.removeCartProduct = function (index) {
		connectCartFactory.remove({productId: $scope.cart[index].productId}, function (response) {
			$scope.cart.splice(index, 1);
			$scope.user.cart = $scope.cart; 
		});
	}

	$scope.goToOrder = function () {
		//go to the create order page , use the state and pass empty parameter to reload the controller
		$state.go('profile.orderCreate', {}, {reload: true});
	}

}]);