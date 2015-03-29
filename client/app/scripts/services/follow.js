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
      console.log("addToFollowing employerUserName ", employerUserName);
      console.log("username ", username);
      return $http({
        method: 'PUT',
        url: 'gitUser/' + employerUserName +'/following',
        data: {
          username: username
        }
      })
      .then(function (res) {
        return res.data;
      })
    };

    function getEmployerUsers (employerUserName) {

      console.log("username for")
      return $http({
        method: 'GET',
        url: 'gitUser/' + username + '/following'
      })
      .then(function(res) {
        return res.data;
      })
    }
    function addNote (note) {
      // return $http({
      //   method: 'PUT',
      //   url: 
      // })

    }
  }
})();


// POST employer/following
// GET 
