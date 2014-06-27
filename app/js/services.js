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
  }]).
  service('reelgenieAPI', ["$http", function($http){
    this.getToken = function($scope){
      var data = {
        api_key: '0c35c79e-141d-4ac7-b5f5-d2c916713dda',
        secret:  'yorksecret'
      };
      var url = 'http://localhost:3003/api/v1/tokens.json';
      return $http({method: 'POST', url: url, data: data, headers: { 'Content-Type': 'application/json'}}).
      then(function(response){
        console.log(response);
        return response.data;
      });
    };
    this.initRequest = function($scope){
      if ($scope.token){
        var data = {
          token:                $scope.token,
          external_project_id:  Math.floor(Math.random()*123456789),
          user_email:           'denis@reelgeniefilms.com',
          project_name:         'AngularTest',
          first_name:           'Denis',
          last_name:            'Kostrom',
          audio_theme:          'RockNRoll',
          design_theme:         'cool',
          title:                'Super',
          subtitle:             'Application'
        };
        var url = 'http://localhost:3003/api/v1/video_requests.json'
        return $http({method: 'POST', url: url, data: data, headers: { 'Content-Type': 'application/json'}}).
        then(function(response){
          console.log(response);
          return response.data;
        });
      }
    };
    this.sendRequest = function($scope){
      var data = {
        token: $scope.token
      };
      var url = "http://localhost:3003/api/v1/video_requests/"+$scope.videoRequestId+"/submit.json"
      return $http({method: 'POST', url: url, data: data, headers: { 'Content-Type': 'application/json'}}).
      then(function(response){
        console.log(response);
        return response.data;
      });
    };
    this.addImages = function($scope, index, url){
      var data = {
        token: $scope.token,
        images: [
          {
            URL: url,
            page: index
          }
        ]
      };
      var url = "http://localhost:3003/api/v1/video_requests/"+$scope.videoRequestId+"/add_images.json"
      return $http({method: 'POST', url: url, data: data, headers: { 'Content-Type': 'application/json'}}).
      then(function(response){
        console.log(response);
        return response.data;
      });
    };
    this.addCommunityImages = function($scope){
      var images = [];
      angular.forEach($scope.communityPhotos, function(value, key){
        var img = {
          URL: value,
          page: key
        };
        images.push(img);
      });
      var data = {
        token: $scope.token,
        images: images
      };
      var url = "http://localhost:3003/api/v1/video_requests/"+$scope.videoRequestId+"/add_images.json"
      return $http({method: 'POST', url: url, data: data, headers: { 'Content-Type': 'application/json'}}).
      then(function(response){
        console.log(response.data);
        return response.data;
      });
    }
  }]);