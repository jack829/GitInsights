// controller for page of all git hub users a gitinsight user is following

(function(){
  'use strict';

  angular.module('gitInsight.following', [])
    .controller('FollowingController', FollowingController);

  FollowingController.$inject = ['$scope', 'GitApi', 'Auth'];
  function FollowingController ($scope, GitApi, Auth) {
    console.log("in following ctrl");
  }
})