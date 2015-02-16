'use strict';

angular.module('productModule').controller('addProductController', ['$scope', '$location', 'connectProductFactory', 'categoryProductFactory', '$state', function ($scope, $location, connectProductFactory, categoryProductFactory, $state) {
	$scope.categoryOptions = categoryProductFactory;

	$scope.showImageUploadThumbnail = function (id) {
		document.getElementById(id).click();
	}

	$scope.addProduct = function () {
		//Show the loading gif
		$scope.loading = true;
	
		connectProductFactory.save($scope.newProduct, function (response) {
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