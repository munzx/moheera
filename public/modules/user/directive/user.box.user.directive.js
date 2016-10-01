'user strict';

angular.module('userModule').directive('userBoxUserDirective', function () {
	return {
		restrict: 'A',
		templateUrl: 'public/modules/user/view/user.box.user.view.html',
		replace: true,
		transclude: true,
		scope: {
			user: '=userBoxUserDirective'
		},
		link: function (scope ,elem, attr) {
			scope.logo = function (logo) {
				if(logo.length){
					return 'public/uploads/' + logo;
				} else {
					return 'public/modules/config/img/user.png';
				}
			}
		}
	}
});