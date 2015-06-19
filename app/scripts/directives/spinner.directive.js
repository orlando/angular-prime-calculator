'use strict';

angular.module('fc.directives.spinner', [])
  .directive('fcSpinner', [
    '$rootScope',
    function fcSpinner($rootScope) {
      return {
        attribute: 'E',
        controller: [
          '$rootScope',
          function ($rootScope) {
            var controller = this;

            $rootScope.$on('spinner.activate', function () {
              controller.active = true;
            });

            $rootScope.$on('spinner.deactivate', function () {
              controller.active = false;
            });
          }
        ],
        controllerAs: 'controller',
        template: '\
          <div class="spinner-container" ng-if="controller.active">\
            <div class="table-cell">\
              <div class="spinner">\
                <div class="double-bounce1"></div>\
                <div class="double-bounce2"></div>\
              </div>\
            </div>\
          </div>\
        ',
        replace: true
      };
    }
  ]);
