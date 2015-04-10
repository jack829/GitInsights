angular.module('gitInsight', [
  'gitInsight.home',
  'ngRoute',
  'gitInsight.gitapi',
  'gitInsight.auth',
  'gitInsight.userinfo',
  'gitInsight.compare',
  'gitInsight.chart',
  'gitInsight.follow',
  'gitInsight.following',
  'gitInsight.user'
])
.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/scripts/home/home.html',
      controller: 'HomeController'
    })
    .when('/user/:username', {
      templateUrl: 'app/scripts/user/user.html',
      controller: 'UserController'
    })
    .when('/following', {
      templateUrl: 'app/scripts/following/usersFollowing.html',
      controller: 'FollowingController'
    })
    .otherwise({
      redirectTo: '/'
    });
});