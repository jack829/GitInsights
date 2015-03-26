(function() {
  'use strict';

  angular.module('gitInsight.follow', [])
    .factory('Follow', Follow);

  Follow.$inject = ['$http', 'Auth'];
  function Follow ($http, Auth) {

    return {
      saveGitUser: saveGitUser
    };

    function saveGitUser (user) {
      console.log("in follow.saveGitUser");
      return $http({
        method: 'POST',
        url: '',
        data: {
          name: user.name,
          username: user.username,
          email: user.email
        }
      })
    }
  }
})();