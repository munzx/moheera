'use strict';

angular.module('moheera').directive('styleImageConfigDirective', ['$modal', '$rootScope', function ($modal, $rootScope) {
	return {
		require: '?ngModel',
		restrict: 'A',
		replace: false,
		transclude: true,
		link: function (scope, elem, attrs, ngModel) {
			//create the canvas
			var x = document.getElementById('lab'),
			canvas = x.getContext("2d"),
			//the image id of the image to be created
			imageId = 'makeImage';
			//set/fill the background color
			canvas.fillStyle = "#fff";
			canvas.fillRect(0, 0, x.width, x.height);

			//on file upload
			elem.bind('change', function (e) {
				//create a new file read object
				var reader = new FileReader();
				reader.onload = function (image) {
					//create image object and set its source to equal the uploaded image source
					var img = document.createElement('img');
						img.src = image.target.result;
						img.id = imageId;
						img.style.display = 'none';

					//add image to container
					var container = document.getElementById('imageContainer');
					container.appendChild(img);
					resizeAndDraw(img.id);

				}
				//upload,initiate and read the selected file through the file input element
				reader.readAsDataURL(elem[0].files[0]);
			});

			//resize the image elemnt and draw it into the canvas
			function resizeAndDraw (id) {
				Caman('#' + id, function () {
					//get current height and width
					var width = this.width,
					height = this.height;
					//set the height to 500 max if exceeded 500
					if(width > x.width){
						width = x.width;
						this.resize({width: width});
					} else {
						width = this.width;
					}

					//render the image
					this.render(function () {
						//get the image source
						var base64 = this.toBase64(),
						//create a new image object and set its source to the rendered image source
						pic = new Image();
						pic.src = base64;
						//on the new image load
						pic.addEventListener("load", function (e) {
							//draw a canvas out of the new rendered image
							//and center the rendred image in the canvas
							canvas.drawImage(pic, (x.width - this.width) / 2, (x.height - this.height) / 2);
						});
					});
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
					resizeAndDraw(imageId);
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
			    	resizeAndDraw(imageId);
				});
			}

		}
	}
}]);