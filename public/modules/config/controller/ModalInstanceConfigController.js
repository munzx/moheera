'use strict';

angular.module('moheera').controller('ModalInstanceConfigController', ['$scope', '$rootScope', '$modalInstance', function ($scope, $rootScope, $modalInstance) {
	// switch(service){
	// 	case 'cart':
	// 	$scope.msg= 'to add this product to cart';
	// 	break;
	// 	case 'heart':
	// 	$scope.msg= 'to heart this product';
	// 	break;
	// 	case 'comment':
	// 	$scope.msg= 'to add a comment';
	// 	break;
	// 	default:
	// 	$scope.msg= 'to complete this operation';
	// }
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	}
}]);