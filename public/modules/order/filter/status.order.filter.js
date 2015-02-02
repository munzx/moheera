'use strict';

angular.module('orderModule').filter('statusOrderFilter', [function () {
	return function (orders, status) {
		var filtered = [];
		if(!status){
			filtered = orders;
		} else {
			for(var i=0; i < orders.length;i++){
				var value = orders[i];
				if(value.status == status){
					filtered.push(value);
				}
			}
		}
		return filtered;
	}
}]);