'use strict';

angular.module('productModule').controller('editProductController', ['$scope', '$stateParams', '$location', 'connectProductFactory', 'categoryProductFactory', function ($scope, $stateParams, $location, connectProductFactory, categoryProductFactory) {
	$scope.categoryOptions = categoryProductFactory;

	connectProductFactory.get({getByName: $stateParams.name}, function (response) {
		$scope.productInfo = response;
	}, function (err) {
		$location.path('/notfound');
	});

	$scope.updateProductInfo = function () {
		var fd = new FormData();
		fd.append('image1', document.getElementById('image1').files[0]);
		fd.append('image2', document.getElementById('image2').files[0]);
		fd.append('image3', document.getElementById('image3').files[0]);
		fd.append('image4', document.getElementById('image4').files[0]);

		fd.append('name', $scope.productInfo.name);
		fd.append('price', $scope.productInfo.price);
		fd.append('quantity', $scope.productInfo.quantity);
		fd.append('category', $scope.productInfo.category);
		fd.append('desc', $scope.productInfo.desc);

		connectProductFactory.update({id: $scope.productInfo._id}, fd, function (response) {
			$scope.error = false;
			$scope.success = true;
		}, function (err) {
			$scope.success = false;
			$scope.error = err.data.message;
		});
	}

}]);