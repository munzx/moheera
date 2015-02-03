'use strict';

angular.module('moheera').directive('watchImageConfigDirective', ['$modal', '$rootScope', function ($modal, $rootScope) {
	return {
		require: '?ngModel',
		restrict: 'A',
		replace: false,
		transclude: false,
		scope: {
			"id": "@id"
		},
		link: function (scope, elem, attrs, ngModel) {
			//Full File API support.
			if ( window.FileReader && window.File && window.FileList && window.Blob ){
				//get the current image source
				var oldSrc = document.getElementById(scope.id + 'Preview').getAttribute('src');
				//get the loading gif image source
				var loadingGif = 'public/modules/home/img/loading.gif';

				//register a click even on an image the has the 'file input' field name plus 'Preview'
				//which when clicked it trigers the click even on the input field to upload a file
				document.getElementById(scope.id + 'Preview').onclick = function () {
					document.getElementById(scope.id).click();
				}

				elem.bind('change', function (e) {
					//here we initiate with a 'false' value to make sure
					//angular will update the form validation and give this value false
					//as when starting the app there would be no file uploaded in the 'input file' field
					scope.$apply(function () {
						if(ngModel){
							ngModel.$setViewValue(elem.val());
							ngModel.$render();
						}
					});

					//get the file data
					var reader = new FileReader();
					//on uploading the file show the 'loading' gif image
					reader.onloadstart = function (image) {
						document.getElementById(scope.id + 'Preview').setAttribute('src', loadingGif);
					}

					//on aborting the file upload by clicking 'cancel' on the upload file window
					//get the 'placeholder' image back
					reader.onabort = function (image) {
						document.getElementById(scope.id + 'Preview').setAttribute('src', path);	
					}

					//after loading validate the uploaded file other wise show the modal 'error message'
					reader.onload = function (image) {
						//make sure the file size is less than 1MB
						if(image.loaded > 1024 * 1024){
							//upadte the 'input file' field to be false as the file size is more than 1MB
							if(ngModel){
								ngModel.$setValidity("file loaded", false);
								ngModel.$render();
							}
							//get the old image back
							document.getElementById(scope.id + 'Preview').setAttribute('src', oldSrc);
							//show the madal 'error message'
							var modalInstance = $modal.open({
								controller: function () {
									$rootScope.cancel = function () {
										modalInstance.dismiss('cancel');
									}
								},
								template: '<button ng-click="cancel()" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="alert alert-danger text-center">Maximum image size is 1MB</h4>'
							});
						} else {
							//if the passed the validation then update the 'input file' field be true
							scope.$apply(function () {
								if(ngModel){
									ngModel.$setValidity("file loaded", true);
									ngModel.$render();
								}
							});
							//make the preview image equals the uploaded image
							var path = image.target.result;
							document.getElementById(scope.id + 'Preview').setAttribute('src', path);
							}
						}
					reader.readAsDataURL(elem[0].files[0]);	
				});

			} else {
				$modal.open({
					template: '<h4 class="alert alert-danger">Please use a modern browser to browse moheera!!!</h4>'
				});
			}
		}
	}
}]);