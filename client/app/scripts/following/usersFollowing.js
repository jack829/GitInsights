// controller for page of all git hub users a gitinsight user is following

(function(){
  'use strict';

  angular.module('gitInsight.following', [])
    .controller('FollowingController', FollowingController);

  FollowingController.$inject = ['$scope', 'GitApi', 'Auth', 'Follow'];
  function FollowingController ($scope, GitApi, Auth, Follow) {
    console.log("in following ctrl; scope.github ", $scope.github);

    

    $scope.getUsersFollowing = function() {
      Follow.getEmployerUsers()
    }
  }


})();