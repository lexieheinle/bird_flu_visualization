var $graphic = $('#graphic');
var graphic_data_url = 'sleepData.js';
var graphic_data;
var graphic_aspect_width = 16;
var graphic_aspect_height = 9;
var mobile_threshold = 500;

function drawGraphic() {
  var margin = {
    top: 10,
    right: 15,
    bottom: 25,
    left: 35
  };
  var width = $graphic.width() - margin.left - margin.right;
  var height = Math.ceil((width * graphic_aspect_height) / graphic_aspect_width) - margin.top - margin.bottom;
  var num_ticks = 13;

  if ($graphic.width() < mobile_threshold) {
    num_ticks = 5;
  }

  //clear out existing graphics
  $graphic.empty();

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(function (d, i) {
      if (width <= mobile_threshold) {
        var fmt = d3.time.format('%y');
        return '\u2019' + fmt(d);
      } else {
        var fmt = d3.time.format("%Y-%m");
        return fmt(d);
      }
    });
  var x_axis_grid = function () {
    return xAxis;
  }
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(num_ticks);
  var y_axis_grid = function () {
    return yAxis;
  }
  var line = d3.svg.line()
    .x(function (d) {
      //console.log(d.date);
      //console.log(x(d.date));
      return x(d.date);
    })
    .y(function (d) {
      //console.log(d.sleepTime);
      //console.log(y(d.sleepTime));
      return y(d.sleepTime);
    });

  //parse data into columns
  var lines = {};
  for (var column in graphic_data[0]) {
    //console.log(graphic_data[0]);
    if (column == 'Start')
      continue;
    lines[column] = graphic_data.map(function (d) {
      //console.log(d["Time in bed"]);
      return {
        'date': d['Start'],
        'sleepTime': d["Time in bed"]
      };
    });
  }
  console.log(lines);

  //draw svg
  var svg = d3.select('#graphic').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  x.domain(d3.extent(graphic_data, function (d) {
    return d['Start'];
  }));

  y.domain([
    d3.min(d3.entries(lines),
      function (c) {
        return d3.min(c.value, function (v) {
          var n = v.sleepTime;
          console.log(Math.floor(n));
          return Math.floor(n);
        });
      }),
    d3.max(d3.entries(lines), function (c) {
      return d3.max(c.value, function (v) {
        var n = v.sleepTime;
        console.log(Math.ceil(n));
        return Math.ceil(n);
      });
    })
  ]);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  svg.append('g')
    .attr('class', 'x grid')
    .attr('transform', 'translate(0,' + height + ')')
    .call(x_axis_grid()
      .tickSize(-height, 0, 0)
      .tickFormat(''));

  svg.append('g')
    .attr('class', 'y grid')
    .call(y_axis_grid()
      .tickSize(-width, 0, 0)
      .tickFormat(''));

  svg.append('g').selectAll('path')
    .data(d3.entries(lines))
    .enter()
    .append('path')
    .attr('class', function (d, i) {
      return 'line line-' + i;
    })
    .attr('d', function (d) {
      return line(d.value);
    });
}

$(window).load(function () {
  if (Modernizr.svg) {
    //if svg is supported, draw dynamic chart
    d3.json(graphic_data_url, function (error, data) {
      graphic_data = data;
      console.log(graphic_data);
      nights = graphic_data.length;
      for (var i = 0; i < nights; i++) {
        if (graphic_data[i]['Time in bed'] != "") {
          hoursEnd = graphic_data[i]['Time in bed'].indexOf(':');
          //console.log(graphic_data[i]['Time in bed'].substring(0, hoursEnd));
          timeLength = graphic_data[i]['Time in bed'].length;
          minutes = graphic_data[i]['Time in bed'].substring((hoursEnd + 1), timeLength);
          hoursFraction = +((parseInt(minutes) / 60).toFixed(2));
          //console.log(hoursFraction);
          newTime = parseInt(graphic_data[i]['Time in bed'].substring(0, hoursEnd)) + hoursFraction;
          //console.log(newTime);
          graphic_data[i]['Time in bed'] = newTime;
        }
      }
      graphic_data.forEach(function (d) {
        d['Start'] = d3.time.format('%Y-%m-%d %X').parse(d['Start']);
        console.log(d['Start']);
        d["Time in bed"] = +d["Time in bed"];
        //console.log(d['Time in bed']);
      });

      drawGraphic();
      window.onresize = drawGraphic;
    });
  }
});