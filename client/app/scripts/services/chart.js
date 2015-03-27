(function () {
'use strict';

angular.module('gitInsight.chart', [])
  .factory('Chart', Chart);


Chart.$inject = [];
function Chart () {

  var usersData = [];

  return {
    lineGraph: lineGraph,
    pieChart: pieChart
  };

 function lineGraph (data, username, type) {

    var secondsPerYear = 525600 * 60;
    var dateNow = new Date() / 1000; //convert to unix
    var dateXYearsAgo = dateNow - (secondsPerYear * 1);

    var netAdditions = [];
    var unixTimeStamps = [];
    var newTimeStamps = [];
    var userData = "";
    var chartNum = 0;
    var yAxisLabel = "";

    usersData = [];

    //Array for selecting line color
    var colors = d3.scale.category10().range();

    //This section parses the data for estimated language usage over time
    if(type === 'languages'){
      chartNum = '#chart2';
      var colorIndex = 0;
      for(var x in data.languages){
        for(var y in data) {
          if(y !== 'languages'){
            unixTimeStamps.push(y);
            if(data[y][x] === undefined){
              netAdditions.push(0);
            } else {
              netAdditions.push(data[y][x]);
            }
          }
        }
        userData = {"key": "Estimated " + x + " usage", "values": []};
        
        for(var i = 0; i < unixTimeStamps.length; i++){
          if (unixTimeStamps[i] > dateXYearsAgo) {
            userData.values.push({x: unixTimeStamps[i], y: netAdditions[i]});
          }
        }
        userData.color = colors[colorIndex];
        colorIndex++;
        usersData.push(userData);
      }
      yAxisLabel = 'Bytes of Code';

    //This section parses the data for total insertions
    } else {
      chartNum = '#chart';
      for(var week in data){
        unixTimeStamps.push(+week);
        netAdditions.push(data[week].a);
      }
    
      userData = {"key": username + "'s Additions", "values": []};

      for(var i = 0; i < unixTimeStamps.length; i++){
        //console.log('code:' + unixTimeStamps[i], dateXYearsAgo);
        if (unixTimeStamps[i] > dateXYearsAgo) {
           userData.values.push({x: unixTimeStamps[i], y: netAdditions[i]});
        }
      }

      userData.color = colors[0];
      usersData.push(userData);

      yAxisLabel = 'Number of Code Insertions';
    }
   
    //graph presents with proper colors if lines are listed lowest to highest   
    usersData.reverse();
    

    nv.addGraph(function() {
      var chart = nv.models.lineChart()
        .useInteractiveGuideline(true)
        .showLegend(true); 

      // Define x axis
      chart.xAxis
        .tickFormat(function(d) {
        return d3.time.format('%x')(new Date(d*1000))
        });

      // Define y axis
      chart.yAxis
        .domain(d3.range(netAdditions))
        .tickFormat(d3.format('d'))
        .axisLabel(yAxisLabel);

      // append defined chart to svg element
      d3.select(chartNum +' svg')
        .datum(usersData)
        .call(chart);

      // resizes graph when window resizes
      nv.utils.windowResize(chart.update());
      return chart;
    });
  };

  function pieChart (languages, config) {

    //Changes format from {JavaScript: 676977.4910200321, CSS: 3554.990878681176, HTML: 41.838509316770185, Shell: 4024.4960858041054}
    // to [{"key": "One", "value": 222}, ... , {"key": "Last", "value": 222}]
    var languageData = d3.entries(languages)

    // Add second pie chart when comparing users.
    var chart = config.chart;


    // nvd3 library's pie chart.
    nv.addGraph(function() {
      var pieChart = nv.models.pieChart()
          .x(function(d) { return d.key })
          .y(function(d) { return d.value })
          .showLabels(true)
          .labelType("percent");

        d3.select(chart + " svg")
            .datum(languageData)
            .transition().duration(350)
            .call(pieChart);

      return pieChart;
    });
  };

}
})();
