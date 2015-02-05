'use strict';

angular.module('moheera').controller('navMenu', ['$rootScope', '$scope', 'registerUserConfigFactory', '$state', function ($rootScope, $scope, registerUserConfigFactory, $state) {
	//initiate the menu in mobile and tables in no collapse status
	$scope.navbarCollapsed = false;

	// Collapsing the menu after navigation
	$scope.$on('$stateChangeSuccess', function() {
		$scope.navbarCollapsed = false;
	});

	// Watch the user
	$rootScope.$watch('logged', function () {
		if($rootScope.logged){
			//get the current user data
			$scope.user = registerUserConfigFactory.getUser();
			$scope.loggedLink = true;
			$scope.notLoggedLink = false;
		} else {
			$scope.loggedLink = false;
			$scope.notLoggedLink = true;
		}
	});


	$scope.searchUser = function () {
		if($scope.searchPhrase){
			$state.go('search.user', {name: $scope.searchPhrase});
		}
	}

	$scope.searchProudct = function () {
		if($scope.searchPhrase){
			$state.go('search.product', {name: $scope.searchPhrase});
		}
	}

}]);
