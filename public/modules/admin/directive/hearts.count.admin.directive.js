'user strict';

angular.module('adminModule').directive('heartsCountAdminDirective', ['connectAdminFactory', function (connectAdminFactory) {
	return {
		require: '?ngModel',
		restrict: 'A',
		templateUrl: '/public/modules/admin/view/hearts.count.admin.directive.view.html',
		replace: true,
		link: function (scope, elem, attrs, ngModel) {
			connectAdminFactory.get({page: 'hearts'}, function (response) {
				scope.heartsCount = response.count;
			});
		}
	}
}]);