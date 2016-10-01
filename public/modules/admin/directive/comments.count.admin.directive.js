'user strict';

angular.module('adminModule').directive('commentsCountAdminDirective', ['connectAdminFactory', function (connectAdminFactory) {
	return {
		require: '?ngModel',
		restrict: 'A',
		templateUrl: '/public/modules/admin/view/comments.count.admin.directive.view.html',
		replace: true,
		link: function (scope, elem, attrs, ngModel) {
			connectAdminFactory.get({page: 'comments'}, function (response) {
				scope.commentsCount = response.count;
			});
		}
	}
}]);