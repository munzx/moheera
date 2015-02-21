'use strict';

angular.module('productModule').controller('editProductController', ['$scope', '$stateParams', '$location', 'connectProductFactory', 'categoryProductFactory', '$state', function ($scope, $stateParams, $location, connectProductFactory, categoryProductFactory, $state) {
	$scope.categoryOptions = categoryProductFactory;

	connectProductFactory.get({getByName: $stateParams.name}, function (response) {
		$scope.productInfo = response;
	}, function (err) {
		$location.path('/notfound');
	});

	$scope.updateProductInfo = function () {
		//form data
		//if we pass the data directly it creates an error so we pass it through an object
		var fd = {};
		fd.name = $scope.productInfo.name;
		fd.price = $scope.productInfo.price;
		fd.quantity = $scope.productInfo.quantity;
		fd.category = $scope.productInfo.category;
		fd.desc = $scope.productInfo.desc;
		fd.image1 = $scope.productInfo.image1;
		fd.image2 = $scope.productInfo.image2;
		fd.image3 = $scope.productInfo.image3;
		fd.image4 = $scope.productInfo.image4;

		connectProductFactory.update({id: $scope.productInfo._id}, fd, function (response) {
			$state.go('profile.editProduct', {name: response.name}, {reload: false});
			$scope.error = false;
			$scope.success = true;
		}, function (err) {
			$scope.success = false;
			$scope.error = err.data.message;
		});
	}

}]);