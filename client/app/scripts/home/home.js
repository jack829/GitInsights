(function(){
  'use strict';

  angular.module('gitInsight.home', ['ngMaterial', 'ngMessages'])
  .controller('HomeController', HomeController)
  //defines the colors
  .config( function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('light-blue')
  })
  .factory('Test',function($http){
    var httpEmployerTest = function(method,employerName,data) {
      return $http({
        method: method,
        url: '/employer/'+employerName,
        data: data
      }).then(function(res) {
        console.log(res.data);
      });
    };
    return {
      httpEmployerTest: httpEmployerTest
    };
  });

  HomeController.$inject = ['$scope', 'GitApi', 'Auth', 'Chart','Test'];

  function HomeController($scope, GitApi, Auth, Chart, Test){
    $scope.github = {};
    $scope.currentUser = {};
    $scope.loaded = false;
    $scope.loaded3 = true;
    $scope.numUsers = 0;
    // Test.httpEmployerTest('GET',"test1",null);
    // Test.httpEmployerTest('POST',"test2",null);
    Test.httpEmployerTest('PUT',"test2",{username: "followingTest",name: "following Test",profileThumbUrl: "http://img.img",});
    // Test.httpEmployerTest('POST',"test3",null);
    // Test.httpEmployerTest('DELETE',"test3",null);
    $scope.login = function(){
      Auth.login()
        .then(function (github) {
          $scope.github = github;
      });
    }

    $scope.logout = function(){
      Auth.logout();
      $scope.github.username = null;
    }

    $scope.getAllWeeklyData = function(username){
      // first we make a set of queries to get data from all the repo's the user has contributed to.
      // the process also tags some metadata to help with chaining
      GitApi.getAllWeeklyData(username)
        .then(function (data){ 
          // here we can immediately process the data to draw a line graph of the user's activity
          var weeklyData = GitApi.reduceAllWeeklyData(data)
          Chart.lineGraph(weeklyData, username);
          $scope.loaded = true;
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
          $scope.numUsers++;
          $scope.loaded3 = !($scope.loaded3);

          var config = {};
          config.chart = "#chart2"
          /*if($scope.numUsers % 2 === 0){
            config.chart = "#chart3"
          }*/

          Chart.pieChart(languages, config);
        });
    };
  }
})();

