'use strict';

angular.module('adminModule').controller('productsAdminController', ['$scope', 'connectAdminFactory', function ($scope, connectAdminFactory) {
	var limit = 20;

	$scope.skipProducts = 0;
	$scope.products = [];

	$scope.addMoreProducts = function () {
		connectAdminFactory.get({page: 'products', "limit": limit, "skip": $scope.skipProducts}, function (response) {
			if(response.products.length > 0){
				for(var i=0; i < response.products.length; i++){
					$scope.products.push(response.products[i]);
					$scope.busy = true;
					console.log($scope.products);
				}
			}
	$scope.photos = [
	    {id: 'p1', 'title': 'A nice day!', src: "http://lorempixel.com/300/400/"},
	    {id: 'p2', 'title': 'Puh!', src: "http://lorempixel.com/300/400/sports"},
	    {id: 'p3', 'title': 'What a club!', src: "http://lorempixel.com/300/400/nightlife"},
	    {id: 'p3', 'title': 'test', src: 'public/uploads/' + $scope.products[0].image1}
	];	
			$scope.busy = false;
		});
		$scope.skipProducts+= limit;
	}



}]);