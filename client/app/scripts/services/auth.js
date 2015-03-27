(function () {
'use strict';

angular.module('gitInsight.auth', [])
  .factory('Auth', Auth);

Auth.$inject = ['$q', '$http'];
function Auth ($q, $http) {
  //Uses Firebase only to authenticate via Github
  //Authenticated Github users are allowed to make 2000api calls/hr vs 60 for unauthenticated users

  //create an instance to interact with firebase api.
  //url refers to Firebase database.
  //for more information about Firebase please refer to http://www.firebase.com
  //var ref = new Firebase("https://boiling-torch-2275.firebaseio.com");
  var ref = new Firebase("https://git-insights.firebaseio.com/");

  var github;

  return {
    login: login,
    getToken: getToken,
    getUsername: getUsername,
    logout: logout,
    saveEmployer: saveEmployer
  };

  function getToken () {
    return github && github.accessToken;
  }

  function getUsername () {
    return github && github.login;
  }

  function login () {
    //creates a popup for authentication via github
    //closes pop after and sets the githubToken for use in GitApi calls
    return $q(function (resolve, reject) {
      ref.authWithOAuthPopup("github", function (error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          reject(error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          github = authData.github;
          resolve(github);
        }
      }, {scope: "repo"});
    })
  }

  function logout () {
    ref.unauth();
    console.log("unauthenticated successfully");
  }

  function saveEmployer(username) {
    console.log("in saveEmployer")
    return $http({
      method: 'POST',
      url: '/employers/' + username
    });
  }
}

})();
