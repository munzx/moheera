'use strict';

angular.module('adminModule').directive('ordersCountAdminDirective', ['connectAdminFactory', function (connectAdminFactory) {
	return {
		require: '?ngModel',
		restrict: 'A',
		templateUrl: '/public/modules/admin/view/orders.count.admin.directive.view.html',
		replace: true,
		link: function (scope, elem, attrs, ngModel) {
			connectAdminFactory.get({page: 'orders'}, function (response) {
				scope.ordersCount = response.count;
			});
		}
	}
}]);