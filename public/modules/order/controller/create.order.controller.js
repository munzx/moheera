'use strict';

angular.module('orderModule').controller('createOrderController', ['$scope', '$location', 'connectOrderFactory', 'registerUserConfigFactory',function ($scope, $location, connectOrderFactory, registerUserConfigFactory) {
	$scope.user = registerUserConfigFactory.getUser();
	$scope.cart = $scope.user.cart;

	$scope.cartInfo = function () {
		var cartItems = $scope.user.cart,
			totalQuantity = 0,
			totalPrice = 0;

		cartItems.forEach(function (item) {
			totalPrice += (item.product[0].price * item.product[0].quantity);
			totalQuantity += item.quantity;
		});

		return {
			"totalQuantity": totalQuantity,
			"totalPrice": totalPrice
		}
	}

	$scope.confirmOrder = function () {
		var orderInfo = {
			"mobilePhone": $scope.newOrder.mobilePhone,
			"address": $scope.newOrder.address,
			"remarks": $scope.newOrder.remarks,
			"status": "pending"
		}

		connectOrderFactory.save({"info": orderInfo}, function (response) {
			$location.path('profile/order/done');
			//make the user cart empty (client side)
			$scope.user.cart = [];
			registerUserConfigFactory.setUser($scope.user);
		}, function (err) {
			$scope.error = err.data.message;
		});
	}


}]);