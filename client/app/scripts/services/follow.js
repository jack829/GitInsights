(function() {
  'use strict';

  angular.module('gitInsight.follow', [])
    .factory('Follow', Follow);

  Follow.$inject = ['$http', 'Auth'];
  function Follow ($http, Auth) {

    return {
      addToFollowing: addToFollowing,
      getEmployerUsers: getEmployerUsers
    };

    function addToFollowing (employerUserName, username) {
      console.log("iin addToFollowing");
      console.log("employerUserName ", employerUserName);
      console.log("username ", username);
      return $http({
        method: 'PUT',
        url: 'employer/' + employerUserName +'/following',
        data: {
          username: username
        }
      })
      // .then(function (res) {

      // })
    };

    function getEmployerUsers (username) {
      //console.log("username for ")
      return $http({
        method: 'GET',
        url: 'employer/' + username + '/following'
      })
    }
  }
})();


// POST employer/following
// GET 