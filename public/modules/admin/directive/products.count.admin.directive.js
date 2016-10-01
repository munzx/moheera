'use strict';

angular.module('adminModule').directive('productsCountAdminDirective', ['connectAdminFactory', function (connectAdminFactory) {
	return {
		require: '?ngModel',
		restrict: 'A',
		templateUrl: '/public/modules/admin/view/products.count.admin.directive.view.html',
		replace: true,
		link: function (scope, elem, attrs, ngModel) {
			connectAdminFactory.get({page: 'products'}, function (response) {
				scope.productsCount = response.count;
			});
		}
	}
}]);