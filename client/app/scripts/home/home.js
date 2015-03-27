(function(){
  'use strict';

  angular.module('gitInsight.home', ['ngMaterial', 'ngMessages'])
  .controller('HomeController', HomeController)
  //defines the colors
  .config( function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('light-blue')
  });

  HomeController.$inject = ['$scope', 'GitApi', 'Auth', 'Chart', 'Follow'];

  function HomeController($scope, GitApi, Auth, Chart, Follow){
    $scope.github = {};
    $scope.currentUser = {};

    $scope.lastUser = {};  //add last user for display purposes
    $scope.usersFollowing = [];
    $scope.loaded = false;
    //$scope.following = false;  //add condition for following
    $scope.loaded3 = true;
    $scope.numUsers = 0;
    
    $scope.login = function(){
      Auth.login()
        .then(function (github) {
          $scope.github = github;
          return github;
      })
      .then(function(github){
        //console.log("scope loging github",github);
        GitApi.storeAndRetrieveUserDataOnLogin(github.username)
        .then(function(res){
          $scope.github.following = res.data.following;
        });
      });
    }

    $scope.follow = function(username){
      GitApi.follow($scope.github.username,username);
      $scope.github.following.push(username);
      console.log("FOLLOWING",$scope.github.following);
      });

    }

    $scope.logout = function(){
      Auth.logout();
      $scope.github.username = null;
    }

    $scope.getAllWeeklyData = function(username){
      // first we make a set of queries to get data from all the repo's the user has contributed to.
      // the process also tags some metadata to help with chaining
      // GitApi.getUserContact(username);
      GitApi.getAllWeeklyData(username)
        .then(function (response){
          //console.log("$scope.github ",$scope.github);
          console.log("RESPONSE",response.data.gitUserData);
          var data = response.data.gitUserData;
          // here we can immediately process the data to draw a line graph of the user's activity
          var weeklyData = GitApi.reduceAllWeeklyData(data)
          Chart.lineGraph(weeklyData, username, 'additions');
          $scope.loaded = true;
          $scope.lastUser.username = $scope.currentUser.username;
          $scope.currentUser = {};
          return data;
        })
        .then(function (data) {
          return GitApi.gatherLanguageData(data);
          // this returns an array of tuples with the form 
          // [user contirbutions to this repo, repo language stats, total repo activity] when it resolves
        })
        .then(function (data) {
          // this time the data is processed to create a pie chart that estimates 
          // the % of the each language the user codes in by taking the repo language stats * (user activity / total repo activity)
          var languages = GitApi.getUserLanguages(data);
          //console.log('weekly repo data');
          //console.log(languages[1]);
          $scope.numUsers++;
          $scope.loaded3 = !($scope.loaded3);

          var config = {};
          //Make the pie chart the third chart
          config.chart = "#chart3"
          /*if($scope.numUsers % 2 === 0){
            config.chart = "#chart3"
          }*/
          
          //Graph the estimated language usage graph
          Chart.lineGraph(languages[1], username, 'languages');
          Chart.pieChart(languages[0], config);
        });
    };

    // add functionality for following users
    // $scope.following = function() {
    //   //console.log("in following!");
    //   $scope.following = !($scope.following);
    // };

    $scope.follow = function(username) {
      console.log("about to follow!");
      GitApi.getUserContact(username)
        .then(function(data){
          // console.log("contact info ", data);
          // console.log("name ", data.name);
          // console.log("email ", data.email);
          var user = {
            username: username,
            name: data.name,
            email: data.email
          }
          // Follow.saveGitUser(user)
          //   .then(function(data){
          //     console.log("followed user")
          //   });
          $scope.usersFollowing.push(user);

        });
    }

    $scope.saveNote = function(note) {
      console.log("saving note:", note)
    }
  }
})();

