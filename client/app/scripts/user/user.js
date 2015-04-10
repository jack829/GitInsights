(function(){
  'use strict';

  angular.module('gitInsight.user', [])
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', 'GitApi', 'Auth'];
  function UserController ($scope, GitApi, Auth) {
    console.log("scope.currentuser ", $scope)
    $scope.userOne = {};
    $scope.userTwo = {};
    $scope.toDo = function(){
      console.log('howdy');
    };
  }
  
})();