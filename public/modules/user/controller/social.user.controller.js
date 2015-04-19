'use strict';

angular.module('userModule').controller('socialUserControlller', ['$scope', 'connectAccountAuthFactory', 'registerUserConfigFactory', '$location', function ($scope, connectAccountAuthFactory, registerUserConfigFactory, $location) {
	var userInfo = registerUserConfigFactory.getUser();

	if($location.search()){
		var values = $location.search();
		if(values.error){
			$scope.error = values.error;
		} else {
			$scope.error = '';
		}
	}

	//set the social media to not connected
	$scope.facebookConnect = 'Not Connected';
	$scope.instagramConnect = 'Not Connected';
	$scope.twitterConnect = 'Not Connected';
	$scope.googleConnect = 'Not Connected';

	connectAccountAuthFactory.get({'action': 'status', id: userInfo._id}, function (response) {
		var socialInfo = response.status;
		socialInfo.forEach(function (info) {
			switch(info.provider){
				case 'facebook':
					$scope.facebookConnect = 'Connected';
					break;
				case 'instagram':
					$scope.instagramConnect = 'Connected';
					break;
				case 'twitter':
					$scope.twitterConnect = 'Connected';
					break;
				case 'google':
					$scope.googleConnect = 'Connected';
					break;
			}
		});
	});

}]);