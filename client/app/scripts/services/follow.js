(function() {
  'use strict';

  angular.module('gitInsight.follow', [])
    .factory('Follow', Follow);

  Follow.$inject = ['$http', 'Auth'];
  function Follow ($http, Auth) {

    return {
      saveGitUser: saveGitUser
    };

    function saveGitUser (employer, user) {
      console.log("in follow.saveGitUser");
      return $http({
        method: 'POST',
        url: 'employer/' + employer.name +'/following'
      })
    };

    function getEmployerUsers (username) {
      console.log("username for ")
      return $http({
        method: 'GET',
        url: 'employer/' + username + '/following'
      })
    }
  }
})();


// POST employer/following
// GET 