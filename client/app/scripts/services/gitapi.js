(function(){
"use strict";

angular.module('gitInsight.gitapi', [])
  .factory('GitApi', GitApi);

GitApi.$inject = ['$q', '$http', 'Auth'];
function GitApi ($q, $http, Auth) {

  var gitApi = 'https://api.github.com/';
  var usersRepos = {};
  var loggedInUser = "";

  return {
    reduceAllWeeklyData: reduceAllWeeklyData,
    getAllWeeklyData: getAllWeeklyData,
    getRepoWeeklyData: getRepoWeeklyData,
    getUserRepos: getUserRepos,
    getUserContact: getUserContact,
    gatherLanguageData: gatherLanguageData,
    getUserLanguages: getUserLanguages,
    storeAndRetrieveUserDataOnLogin:storeAndRetrieveUserDataOnLogin,
    follow:follow
  };

  //a week is an array of objects
  //each object is in the form of {additions: #, deletions #, week:#(UNIX time)}
  //we extract the additions and deletions from each data object for each week, from each repo
  //we return an array of reduced week objects to graph the total additions/deletions
  function reduceAllWeeklyData (array, username) {
    var reduced = {};
    //console.log(array);
    array.forEach(function (result) {
      if(result !== undefined && result !== null){
        result.weeks.forEach(function (data) {
            var week = data.w;
            for (var key in data) {
              reduced[week] = reduced[week] || {};
              reduced[week][key] = (reduced[week][key] || 0) + data[key];
            delete reduced[week].w;
          }
        });
      }
    });
    return reduced;
  }

  // returns data from each api call
  // after all successfully resolves
  function getAllWeeklyData (username) {
    //console.log("USERNAME ",username);
    return get('/gitUser/'+username)
    .then(function(res) {

      if(res.data.length===0){
        //console.log("GET negative res",res);
        return getUserRepos(username)
          .then(function (repos) {
            console.log("REPOS",repos);
            var promises = repos.map(function (repo) {
              return getRepoWeeklyData(repo, username);
            });
              return $q.all(promises);
            })
          .then(function(data){
            console.log("POST:",data);
            return post('/gitUser/'+username,data);
          })
      } else {
        //console.log("GET positive res",res);
        return res;
      }
    });
  }

  function storeAndRetrieveUserDataOnLogin(username){
    return get('/gitUser/'+username+'/nf')
    .then(function(res) {
      loggedInUser = username;
      //console.log("res",res);
      if(res.data.length===0){
        return getUserRepos(username)
          .then(function (repos) {
            var promises = repos.map(function (repo) {
              return getRepoWeeklyData(repo, username);
            });
              return $q.all(promises);
            })
          .then(function(data){
            //console.log("POST:",data);
            return post('/gitUser/'+username,data);
          })
      } else {
        return res;
      }
    });
  }

  function get (url, params) {
    //Auth.getToken() retrieves the gitToken when a user authenticates with
    //firebase's Github Provider

    // curl -u <token>:x-oauth-basic https://api.github.com/user
    // curl -u <token>:x-oauth-basic https://api.github.com/user/repos

    //perhaps extend params with given input
    params = params || {access_token: Auth.getToken()};
    //console.log('params: ', params);
    return $http({
      method: 'GET',
      url: url,
      params: params
    });
  }

  function post (url,data){
    return $http(
      {
        method: 'POST',
        url: url,
        data: data
      }
    );
  }

  function follow(loggedInUser,toFollowUsername){
    return $http({
      method: 'PUT',
      url: '/gitUser/' + loggedInUser,
      data: {
        username: toFollowUsername
      }
    })
    .then(function (res) {
      //console.log("FOLLOW res",res);
      //console.log("FOLLOW res.data",res.data);
      return res.data;
    })
  };


  //returns an array of additions/deletions and commits
  //made by a user for a given repo
  function getRepoWeeklyData (repo, username) {
    var contributors = repo.url + '/stats/contributors';
    //console.log('contr:' + contributors);

    return get(contributors).then(function (res) {
      var numContributors = res.data.length;
      //if there are multiple contributors for this repo,
      //we need to find the one that matches the queried user
      for(var i = 0; i < numContributors; i++){
        if(res.data[i].author.login === username) {
          var data = res.data[i];
        //we attach some metadata that will help us with chaining these queries
          data.url = repo.url;
          data.numContributors = numContributors;
          return data;
        }
      }
    });
  }

  function getUserRepos (username) {
    //if cached, return repo list as promise
    if (usersRepos[username]) {
      return $q(function (resolve, reject) {
        return resolve(usersRepos[username]);
      });
    }
    var userRepos;
    //else, fetch via api
    //currently only fetches repos owned by user
    //TODO: Fetch all repos user has contributed to
    //console.log("Auth.getToken()",Auth.getToken());
    console.log("USERNAME",username);
    if(loggedInUser===username){
      //console.log("HAVE ONE");
      userRepos = gitApi + 'user/' + 'repos';
    } else {
      userRepos = gitApi + 'users/' + username + '/repos';
    }
    console.log("USERREPOS",userRepos);
    // console.log(get(userRepos));
    // console.log(get(userRepos).$$state);
    return get(userRepos).then(function (res){
      //console.log("Repos:", res.data);
      //console.log("Count:", res.data.length);
      var repos = res.data;
      var username = res.data[0].owner.login;
      usersRepos[username] = repos;
      return usersRepos[username];
    });
  }

  function getUserContact (username) {
    var userContact = gitApi + "users/" + username;
    return get(userContact).then(function (res) {
      return res.data;
    });
  }

  // In order to get an idea of the user's language use,
  // we first supply information about all repos the user has contributed to.

  // For each repo, we make at most two requests,
  // getLanguageStats gathers the language statstic for that repo, 
    // if the user is the sole contributor for the repo, 
      // we can add the language stat directly to the final result
    // else, getCodeFrequency gets the repo's data for weekly additions/deletions
      // the ratio between the user's and the repo's net additions is used to estimate
      // the portion the user has contributed to the repo in each language.

  // This approximation strives to reduce the number of api calls to Github
  // while giving a reasonable estimate of the user's language use.

  // Please let us know if there is a better way.

  function gatherLanguageData (data) {
    var promises = data.map(function (repo) {
      if (repo) {
        var requests = [repo];
        requests[1] = getLanguageStats(repo);

        //only get code frequency if the repo has multiple contibutors
        //otherwise we can just add the languageStat directly.
        if(repo.numContributors > 1) {
          requests[2] = getCodeFrequency(repo);
        }

        return $q.all(requests);
      } else {
        return [];
      }
    });
    //$q is angular's light version of the q promise library
    //each api call executes asynchronously,
    //we return only when all of them have resolved
    return $q.all(promises);
  }

  // Once all the requests have been resolved, we can sum the values 
  // across all repos and get an estimate of the user's language use
  // based on the total number of bytes per language.
  function getUserLanguages (repos) {
    var results = [];
    var total_weekly_language_data = {};
    var total_languages = {};
    var squashed = {};

    repos.forEach(function (repo) {
      var result = estimateUserContribution(repo);
      if (result) {
        //console.log('result1');
        //console.log(result[1]);
        for (var language in result[0]) {
          if (squashed[language]) {
            squashed[language] += result[0][language];
          } else {
            squashed[language] = result[0][language];
          }
          //Save all languages
          if(total_languages[language] === undefined){
            total_languages[language] = 1;
          }
          //Loop through the weeks for repo, gathering language data per week
          for(var week in result[1]) {
            if(total_weekly_language_data[week] === undefined){
              total_weekly_language_data[week] = {};
            }

            if(total_weekly_language_data[week][language] === undefined)
            {              
              total_weekly_language_data[week][language] = result[1][week][language] || 0;
            } else {
              total_weekly_language_data[week][language] += result[1][week][language] || 0;
            }
          }

        }
      }
    });
    total_weekly_language_data.languages = total_languages;
    results.push(squashed);
    results.push(total_weekly_language_data);
    return results;
  }

  //returns an object representing the number of bytes
  //each language used in this repo uses.
  function getLanguageStats (repo) {
    var repoLanguages = repo.url + '/languages'
    return get(repoLanguages).then(function (res) {
      return res.data;
    });
  }

  //returns an array of arrays
  //each subarray contains information about the total number of additions/deletions
  //for a given week made in this repo
  function getCodeFrequency (repo) {
    var repoCodeFreq = repo.url + '/stats/code_frequency';
    return get(repoCodeFreq).then(function (res) {
      return res.data;
    });
  }

  function estimateUserContribution (repo) {
    var result = {};
    var weekly_results = {};
    var total_results = [];
    // no data on repo
    if (repo.length === 0){
      return null;
    }

    // no request for contributor data,
    // user is sole contributor
    // return entire languageStat
    /*if (!repo[2]) {
      return repo[1];
    }*/

    var weeklyData = repo[0].weeks;
    var languageStats = repo[1];
    var codeFreq = repo[2];

    var userNetAdditions = 0;
    var repoNetAdditions = 0;

    
    //weeklyData is an array of week objects
    //with the format {additions:#, deletions:#, week:#(UNIX Timestamp)}
    weeklyData.forEach(function (week) {
      userNetAdditions += (week.a - week.d);
      //create an object for weekly data
      weekly_results[week.w] = {};
      //record users additons
      weekly_results[week.w].user = week.a;
    });

    //codeFreq is is an array of arrays
    //with the format [timestamp, additions, deletions]
    if(codeFreq !== undefined){
      codeFreq.forEach(function (week) {
        //repoNetAdditions += (week[1] - week[2]);
        //Just record total additions
        repoNetAdditions += week[1]; 
        //record total additions for the week
        weekly_results[week[0]].total = week[1];
      });
    }

    var ratio = (userNetAdditions/repoNetAdditions);

    weeklyData.forEach(function (week) {
      //get the precentage user contributed by taking the user additons and dividing by the total additons
      weekly_results[week.w].userPercent = (weekly_results[week.w].user / weekly_results[week.w].total);
    });

    for (var key in languageStats) {
      result[key] = languageStats[key] * ratio;
      for(var x in weekly_results) {
        //calculate the estimated languages percentage per week 
        weekly_results[x][key] = languageStats[key] * weekly_results[x].userPercent;
      }
    }

    //If no contributors just return the total language stats
    if (!repo[2]) {
      result = repo[1];
    }

    total_results.push(result);
    total_results.push(weekly_results);
    return total_results;
  }

}


})();
