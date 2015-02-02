'use strict';

angular.module('productModule').directive('commentIconProductDirective', ['registerUserConfigFactory', function (registerUserConfigFactory) {
	return {
		restrict: 'A',
		templateUrl: 'public/modules/product/view/comment.icon.product.view.html',
		replace: true,
		transclude: true,
		scope: {
			product: '=commentIconProductDirective'
		},
		link: function (scope, elem, attrs) {
			//the product comment is passed through the controller!!!
			//think of the comment template as part of the page that contains it,
			//and think of a scope object passed  eaither from the controller
			//or the through an ng-repeat , now the comment code must be able to access
			//the object named comment and thats what happens here!!!
			var user = registerUserConfigFactory.getUser();
			scope.$watch('product', function (value) {
				var getStatus = function () {
					if(value){
						if(value.comment.length > 0){
							var comments = value.comment;
							//to access the comment 'owner' info embedded in the product retrieved from moheera api
							// product.comment[array].user[array].'info'
							for(var i=0;i < comments.length;i++){
								if(comments[i].author[0]._id == user._id){
									return true;
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

			scope.addComment = function () {
				if($scope.newComment){
					connectCommentProductFactory.save({id: $scope.product._id},{content: $scope.newComment}, function (response) {
						$scope.product.comment.push(response);
						$scope.newComment = '';
					}, function (err) {
						$scope.error = err.data.message;
					});
				}
			}

			scope.removeComment = function (index, commentId, productId) {
				connectCommentProductFactory.remove({commentId: commentId, id: productId}, function (response) {
					$scope.product.comment.splice(index, 1);
				}, function (err) {
					$scope.error = err.data.message;
				});
			}


		}
	}
}]);