'user strict';

angular.module('adminModule').directive('usersCountAdminDirective', ['connectAdminFactory', function (connectAdminFactory) {
	return {
		require: '?ngModel',
		restrict: 'A',
		templateUrl: '/public/modules/admin/view/users.count.admin.directive.view.html',
		replace: true,
		link: function (scope, elem, attrs, ngModel) {
			connectAdminFactory.get({page: 'users'}, function (response) {
				scope.usersCount = response.count;
			});
		}
	}
}]);