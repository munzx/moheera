'use strict';

angular.module('adminModule').controller('categoryAdminController', ['$scope', 'connectAdminFactory', '$filter', function ($scope, connectAdminFactory, $filter) {
	$scope.getCategories = function () {
		connectAdminFactory.query({'page': 'category'}, function (response) {
			$scope.categories = response;
			$scope.catName = [];
			for(var i=0;i < response.length;i++){
				$scope.catName.push(response[i].name);
			}
		});
	}

	//initiate get categories
	$scope.getCategories();

	$scope.showNewCategoryForm = function () {
		$scope.getCategories();
		$scope.entryMode = true;
		$scope.error = false;
		$scope.categoryName = '';
		$scope.parentCategory = '';
	}

	$scope.cancel = function () {
		$scope.entryMode = false;
		$scope.error = false;
	}

	$scope.addCategory = function () {
		$scope.error = false;
		var category = {
			name: $scope.categoryName,
			parent: $scope.parentCategory
		}
		connectAdminFactory.save({'page': 'category'}, {category: category}, function (response) {
			$scope.categories.push(response);
			$scope.entryMode = false;
		}, function (response) {
			$scope.error = response.data.message;
		});
	}

	$scope.updateCategory = function (index, id) {
		$scope.error = false;
		var category = $scope.categories[index];
		connectAdminFactory.update({'page': 'category', 'id': id}, {category: category}, function (response) {
			$scope.getCategories();
		},
		function (response) {
			$scope.error = response.data.message;
			$scope.getCategories();
		});
	}

	$scope.removeCategory = function (id, index) {
		$scope.error = false;
		connectAdminFactory.remove({'page': 'category', 'id': id}, function (response) {
			$scope.categories.splice(index, 1);
		}, function (response) {
			$scope.error = response.data.message;
		});
	}


}]);