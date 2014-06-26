'use strict';

// Preloading all templates during app bootstrap
angular.module('myApp').
run(["$templateCache", "$http", "$route", function($templateCache, $http, $route) {
  var url;
  for (var i in $route.routes) {
    if ($route.routes[i].preload) {
      if (url = $route.routes[i].templateUrl) {
        $http.get(url, { cache: $templateCache });
      }
    }
  }
}]);