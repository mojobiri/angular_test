'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', 'photoService', 'ENV', 'reelgenieAPI', function($scope, photoService, ENV, reelgenieAPI) {
    $scope.communityPhotos = [];
    $scope.userImages = {};
    var disableSubmit = false;

    photoService.getCommunityPhotos(ENV.communityPhotosUrl).then(function(data){
      $scope.communityPhotos = data;
    });

    reelgenieAPI.getToken().then(function(data){
      $scope.token = data.token;
      reelgenieAPI.initRequest($scope).then(function(data){
        $scope.videoRequestId = data.video_request_id;
        console.log(data);
      });
    });

    $scope.disableSubmit = function(){
      // Button for request submitting should be disabled if no token present or if request was already sent.
      if (disableSubmit || !$scope.token) return true;
      return false;
    };

    $scope.sendRequest = function(){
      disableSubmit = true;
      reelgenieAPI.sendRequest($scope).then(function(data){
        console.log(data);
      });
    };

    photoService.populateImagesFromCache($scope);

    $scope.getTimes = function(n) {
      return new Array(n);
    };
  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }])
  .controller('UploadsController', [ '$scope', '$upload', 'myCache', 'ENV', 'reelgenieAPI',  function($scope, $upload, myCache, ENV, reelgenieAPI) {
    // TODO refactor this and move to services
  	$scope.onFileSelect = function($files, $index) {
      var index = $index + 1;
      $scope.userImages = {};
      $scope.progress = {};
      // var cache = myCache.get('myData');
      //$files: an array of files selected, each file has name, size, and type.
      for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: ENV.uploadUrl, //upload.php script, node.js route, or servlet url
        method: 'POST',
        // headers: {'header-key': 'header-value'},
        // withCredentials: true,
        data: {myObj: $scope.myModelObj},
        file: file, // or list of files: $files for html5 only
        /* set the file formData name ('Content-Desposition'). Default is 'file' */
        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
        //formDataAppender: function(formData, key, val){}
      }).progress(function(evt) {
      	$scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        // console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        // TODO write directive to handle URLs returned
        $scope.userImages[index] = data.url;
        reelgenieAPI.addImages($scope).then(function(data){
          console.log(data);
        });
        // console.log(myCache.get('myData'));
        // Populate Images Cache
        var lastCachedObj = {};
        lastCachedObj.userImages = [];
        lastCachedObj.userImages[0] = {};
        lastCachedObj.userImages[0][index] = data.url;
        var cachedUserImages = (myCache.get('myData') || {})['userImages'];

        if (cachedUserImages) lastCachedObj.userImages = lastCachedObj.userImages.concat(cachedUserImages);

        myCache.put('myData', lastCachedObj);
        console.log(myCache.get('myData'));
      });
      //.error(...)
      //.then(success, error, progress);
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
    }
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
  };
}]);