'use strict';

angular.module('productModule').controller('addProductController', ['$scope', '$location', 'connectProductFactory', 'categoryProductFactory', '$state', function ($scope, $location, connectProductFactory, categoryProductFactory, $state) {
	$scope.categoryOptions = categoryProductFactory;

	$scope.showImageUploadThumbnail = function (id) {
		document.getElementById(id).click();
	}

	$scope.addProduct = function () {
		//Show the loading gif
		$scope.loading = true;

		var fd = new FormData();
		fd.append('image1', document.getElementById('image1').files[0]);
		fd.append('image2', document.getElementById('image2').files[0]);
		fd.append('image3', document.getElementById('image3').files[0]);
		fd.append('image4', document.getElementById('image4').files[0]);

		fd.append('name', $scope.newProduct.name);
		fd.append('price', $scope.newProduct.price);
		fd.append('quantity', $scope.newProduct.quantity);
		fd.append('category', $scope.newProduct.category);
		fd.append('desc', $scope.newProduct.desc);

		connectProductFactory.save(fd, function (response) {
			//go to profile page , use the state and pass empty parameter to reload the controller
			$state.go('profile', {}, {reload: true});
			$scope.loading = false;
		}, function (err) {
			$scope.loading = false;
			console.log(err);
			$scope.error = err.data.message;
		});
	}

	$scope.count = function () {
		var count = [];
		for(var i=1;i<=20;i++){
			count.push(i);
		}
		return count;
	}
}]);