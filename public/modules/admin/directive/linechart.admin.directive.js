'use strict';

angular.module('adminModule').directive('lineChartAdminDirective', ['$q', 'connectAdminFactory', function ($q, connectAdminFactory) {
	 return {
		require: '?ngModel',
		restrict: 'A',
		templateUrl: '/public/modules/admin/view/linechart.admin.directive.view.html',
		replace: true,
		link: function (scope, elem, attrs, ngModel) {
			function getLineChartAnalysis (dateFrom) {
				$q.all([
					connectAdminFactory.get({action: 'carts', page: 'analysis', param: dateFrom}).$promise,
					connectAdminFactory.get({action: 'orders', page: 'analysis', param: dateFrom}).$promise,
					connectAdminFactory.get({action: 'hearts', page: 'analysis', param: dateFrom}).$promise,
					connectAdminFactory.get({action: 'comments', page: 'analysis', param: dateFrom}).$promise,
					connectAdminFactory.get({action: 'products', page: 'analysis', param: dateFrom}).$promise,
					connectAdminFactory.get({action: 'users', page: 'analysis', param: dateFrom}).$promise
				]).then(function (result) {
					scope.lineData = [
						result[0].dataPoints,
						result[1].dataPoints,
						result[2].dataPoints,
						result[3].dataPoints,
						result[4].dataPoints,
						result[5].dataPoints
					]
					scope.lineLabels = result[0].fullDate;
					scope.dateFrom = new Date(scope.lineLabels[0]);
				}, function (err) {
					console.log(err);
				});

				scope.lineLabels = ["January", "February", "March", "April", "May", "June", "July"];
				scope.lineSeries = ['Products', 'Comments', 'Hearts', 'Orders', 'Cart', 'Users'];
				scope.lineData = [
					[],
					[],
					[],
					[],
					[],
					[]
				];
			}

			//initilize the line chart
			getLineChartAnalysis();

			scope.getAnalysisButtton = function () {
				getLineChartAnalysis(scope.dateFrom);
			}
		}
	}
}]);