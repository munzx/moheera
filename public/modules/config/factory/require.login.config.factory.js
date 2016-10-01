'use strict';

angular.module('moheera').factory('requreLoginConfigFactory', ['$modal', '$rootScope', '$location', function ($modal, $rootScope, $location) {
	return {
		open: function (service) {
			$rootScope.lastPage = $location.path();
			if(!service){
				service = '';
			}
			$modal.open({
				templateUrl: 'public/modules/config/view/require.login.config.view.html',
				size: 'md',
				controller: 'ModalInstanceConfigController'
				//function ($scope, $modalInstance){
					// switch(service){
					// 	case 'cart':
					// 		$scope.msg = 'to add this product to cart';
					// 		break;
					// 	case 'heart':
					// 		$scope.msg = 'to heart this product!';
					// 		break;
					// 	case 'comment':
					// 		$scope.msg = 'to add a comment';
					// 		break;
					// 	default:
					// 		$scope.msg = 'to complete this operation';
					// }
					// $scope.cancel = function () {
					// 	$modalInstance.dismiss('cancel');
					// }
				//}
			});
		}

	}

}]);