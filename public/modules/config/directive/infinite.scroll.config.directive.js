'use struct';

angular.module('moheera').directive('infiniteScrollConfigDirective', ['$window', function ($window) {
    return function(scope, element, attrs) {
        var placeSaver = 0;
        scope.addMore();
        angular.element($window).bind("scroll", function() {
             if ( (this.pageYOffset >= 100) && (placeSaver < this.pageYOffset) ) {
                placeSaver = this.pageYOffset;
                scope.addMore();
                scope.boolChangeClass = true;
             }
        });
    };
}])