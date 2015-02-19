'use strict';

angular.module('moheera').directive('styleImageConfigDirective', ['$modal', '$rootScope', function ($modal, $rootScope) {
	return {
		require: '?ngModel',
		restrict: 'A',
		replace: false,
		transclude: true,
		link: function (scope, elem, attrs, ngModel) {
			var imageId = 'makeImage',
				img = '';
			//on file upload
			elem.bind('change', function (e) {
				//create a new file read object
				var reader = new FileReader();
				reader.onload = function (image) {
					//create image object and set its source to equal the uploaded image source
					img = document.createElement('img');
					img.src = image.target.result;
					img.id = imageId;
						//img.style.display = 'none';

					//add image to container
					var container = document.getElementById('imageContainer');
					container.appendChild(img);

					img.onload = function () {
						resizeAndDraw(imageId);	
					}

				}
				//upload,initiate and read the selected file through the file input element
				reader.readAsDataURL(elem[0].files[0]);
			});

			//resize the image elemnt and draw it into the canvas
			function resizeAndDraw (id) {
				Caman('#' + id, function () {
					this.resize({width: 400});
					//render the image
					this.render();
				});
			}

			scope.save = function () {
				Caman('#' + imageId, function () {
					this.render(function () {
						 this.save();
					});
				});
			}

			scope.reset = function () {
				Caman('#' + imageId, function () {
					this.revert();
				});
			}

			scope.imageFilter = function (name) {
			    Caman('#' + imageId, function () {
			    	this.revert();
			    	switch(name){
			    		case "crossProcess":
			    			this.crossProcess();
			    			break;
			    		case "vintage":
			    			this.vintage();
			    			break;
			    		case "lomo":
			    			this.lomo()
			    			break;
			    		case "clarity":
			    			this.clarity();
			    			break;
			    		case "love":
			    			this.love();
			    			break;
			    		case "oldBoot":
			    			this.oldBoot();
			    			break;
			    		case "glowingSun":
			    			this.glowingSun();
			    			break;
			    		case "hazyDays":
			    			this.hazyDays();
			    			break;
			    		case "nostalgia":
			    			this.nostalgia();
			    			break;
			    		case "hemingway":
			    			this.hemingway();
			    			break;
			    		case "concentrate":
			    			this.concentrate();
			    			break;
			    		case "jarques":
			    			this.jarques();
			    			break;
			    		case "pinhole":
			    			this.pinhole();
			    			break;
			    		case "grungy":
			    			this.grungy();
			    			break;
			    	}
			    	this.render();
				});
			}

		}
	}
}]);