'use strict';

angular.module('userModule').directive('sidebarLogoUserDirecive', [function () {
	return {
		restrict: 'A',
		template: '<h1></h1>',
		replace: true,
		transclude: false,
		link: function (scope, elem, attrs) {
			console.log(userInfo);
			scope.$watch('userInfo', function (value) {
				var logo;
					//create the html elment with the image link and assign in to "logo" variable
					//or if the user has no logo then assign a placeholder vector image to the logo variable 
					if(value.logo){
						logo = '<div class="row" style="background-color:#fff;padding-bottom:8%;">
						<div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2">
						<a ng-href="/'+ value.name +'">
						<img style="margin-bottom:-2%;" class="img-responsive box-center" src="' + "public/uploads/" + value.logo + '">
						</a>
						</div>
						</div>';
					} else {
						logo = '<div class="row" style="background-color:#fff;padding-bottom:5%;padding-top:5%;">
						<div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
						<a ng-href="/'+ value.name +'">
						<span class="glyphicon glyphicon-user img-responsive text-center" style="font-size:164px;color: #cccccc;" aria-hidden="true"></span>
						</a>
						</div>
						</div>';
				}
				//embed the logo at the top of the sidebar
				elem.parent().prepend(logo);
			});
		}
	}
}]);