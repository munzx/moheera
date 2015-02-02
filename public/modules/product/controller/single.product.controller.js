'use strict';

angular.module('productModule').controller('singleProductController', ['$scope', '$stateParams', 'connectProductFactory', '$location', 'connectCommentProductFactory', 'registerUserConfigFactory', 'connectCartFactory', '$state', 'requreLoginConfigFactory', function ($scope, $stateParams, connectProductFactory, $location, connectCommentProductFactory, registerUserConfigFactory, connectCartFactory, $state, requreLoginConfigFactory) {
	$scope.user = registerUserConfigFactory.getUser();

	$scope.productName = $stateParams.name;

	connectProductFactory.get({getByName: $scope.productName}, function (response) {
		$scope.product = response;
	}, function (err) {
		$location.path('/notfound');
	});

	$scope.showRemoveProductBox = function () {
		$scope.removeProductBox = true;
	}

	$scope.removeProduct = function () {
		connectProductFactory.remove({id: $scope.product._id},function (response) {
			//go to profile page , use the state and pass empty parameter to reload the controller
			$state.go('profile', {}, {reload: true});
		}, function (err) {
			$scope.error = err.data.message;
		});
	}

	$scope.cancelRemoveProduct = function () {
		$scope.removeProductBox = false;
	}

	$scope.addComment = function () {
		if($scope.newComment){
			connectCommentProductFactory.save({id: $scope.product._id},{content: $scope.newComment}, function (response) {
				$scope.product.comment.push(response);
				$scope.newComment = '';
			}, function (err) {
				if(err.status == 403){
					requreLoginConfigFactory.open('comment');
				} else {
					$scope.error = err.data.message;
				}
			});
		}
	}

	$scope.removeComment = function (index, commentId, productId) {
		connectCommentProductFactory.remove({commentId: commentId, id: productId}, function (response) {
			$scope.product.comment.splice(index, 1);
		}, function (err) {
			$scope.error = err.data.message;
		});
	}

}]);