'use strict';

angular.module('adminModule').directive('cartsCountAdminDirective', ['connectAdminFactory', function (connectAdminFactory) {
	return {
		require: '?ngModel',
		restrict: 'A',
		templateUrl: '/public/modules/admin/view/carts.count.admin.directive.view.html',
		replace: true,
		link: function (scope, elem, attrs, ngModel) {
			connectAdminFactory.get({page: 'carts'}, function (response) {
				scope.cartsCount = response.count;
			});
		}
	}
}]);