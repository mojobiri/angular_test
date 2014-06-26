'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1').
  factory('myCache', function($cacheFactory) {
    return $cacheFactory('myData');
  }).
  service('photoService',["$http", 'myCache', function($http, myCache){
    this.getCommunityPhotos = function(url){
      // TODO There should sit $http request to Rails app. $http returns promise obj, so need to carry it properly
      return $http({method: 'GET', url: url, responseType: 'json', cache: true}).
        success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        // console.log(data);
        // return data;
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      }).then(function(response){
        return response.data;
      });
      // return [{'url': 'http://www.facepla.net/images/stories2/770/mexico2.jpg'},{'url':'http://www.facepla.net/images/stories2/770/mexico2.jpg'},{'url': 'http://www.vokrugsveta.ru/img/cmn/2007/07/24/033.jpg'}];
    };
    this.populateImagesFromCache = function($scope){
      var cachedUserImages = (myCache.get('myData') || {})['userImages'];
      if (cachedUserImages){
        angular.forEach(cachedUserImages, function(value, key){
          var imageId = Object.keys(value).toString();
          $scope.userImages[imageId] = value[imageId];
        })
      }
    }
  }]);