(function() {
  'use strict';

  angular.module('gitInsight.follow', [])
    .factory('Follow', Follow);

  Follow.$inject = ['$http', 'Auth', '$q'];
  function Follow ($http, Auth, $q) {

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
        url: 'gitUser/' + jack829 +'/following',
        data: {
          username: username
        }
      })
      .then(function (res) {
        return res.data;
      })
    };

    function getEmployerUsers (username) {

      //console.log("username for ")
      // return $http({
      //   method: 'GET',
      //   url: 'employer/' + username + '/following'
      // })
      // .then(function(res) {
      //   return res.data;
      // })
    }
  }
})();


// POST employer/following
// GET 