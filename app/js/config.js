"use strict";

 angular.module("config", [])

.constant("ENV", {
  "name": "development",
  "uploadUrl": "http://localhost:3003/upload.json",
  "communityPhotosUrl": "http://localhost:3003/list.json"
})

;