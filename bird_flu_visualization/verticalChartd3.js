'use strict';
var data = [{
  "company": "Bank of America",
  "nonMonetary": 7087,
  "monetary": 3548
}, {
  "company": "Experian",
  "nonMonetary": 9648,
  "monetary": 311
}, {
  "company": "Citibank",
  "nonMonetary": 2316,
  "monetary": 3736
}, {
  "company": "TransUnion",
  "nonMonetary": 4823,
  "monetary": 76
}, {
  "company": "Wells Fargo",
  "nonMonetary": 2114,
  "monetary": 2613
}, {
  "company": "JPMorgan Chase",
  "nonMonetary": 1217,
  "monetary": 2858
}, {
  "company": "Capital One",
  "nonMonetary": 1129,
  "monetary": 2286
}, {
  "company": "GE Capital Retail",
  "nonMonetary": 1085,
  "monetary": 2189
}, {
  "company": "Enhanced Recovery Company, LLC",
  "nonMonetary": 1979,
  "monetary": 1
}, {
  "company": "U.S. Bancorp",
  "nonMonetary": 956,
  "monetary": 1016
}, {
  "company": "Encore Capital Group",
  "nonMonetary": 1654,
  "monetary": 19
}, {
  "company": "TD Bank",
  "nonMonetary": 389,
  "monetary": 1123
}, {
  "company": "Portfolio Recovery Associates, Inc.",
  "nonMonetary": 1386,
  "monetary": 1
}, {
  "company": "Amex",
  "nonMonetary": 467,
  "monetary": 849
}, {
  "company": "Navient",
  "nonMonetary": 612,
  "monetary": 646
}, {
  "company": "Discover",
  "nonMonetary": 538,
  "monetary": 671
}, {
  "company": "SunTrust Bank",
  "nonMonetary": 404,
  "monetary": 722
}, {
  "company": "Allied Interstate LLC",
  "nonMonetary": 991,
  "monetary": 4
}, {
  "company": "PNC Bank",
  "nonMonetary": 315,
  "monetary": 524
}].sort(function (obj1, obj2) {
  // Ascending: first flock less than the previous
  return (obj2.nonMonetary + obj2.monetary) - (obj1.nonMonetary + obj1.monetary);
});
var margin = { //vertical chart
    top: 20,
    right: 30,
    bottom: 250,
    left: 50
  },
  width = 1000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom,
  barPadding = 2,
  barWidth = width / data.length;

var chart = d3.select("#chart")
  .attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
  })
  .append("g")
  .attr({
    transform: "translate(" + margin.left + "," + margin.top + ")"
  });

var xScale = d3.scale.ordinal()
  .domain(data.map(function (d) {
    return d.company;
  }))
  .rangeRoundBands([0, width], 0.1);

var yScale = d3.scale.linear()
  .domain([0, d3.max(data, function (d) {
    return d.nonMonetary;
  }) + 100])
  .range([height, 0]); //should be height, 0

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left");

var bar = chart.selectAll("g")
  .data(data)
  .enter().append("g")

bar.append("rect")
  .attr({
    x: function (d) {
      return xScale(d.company)
    },
    y: function (d) {
      return yScale(d.nonMonetary);
    },
    width: xScale.rangeBand(),
    height: function (d) {
      return height - yScale(d.nonMonetary);
    },
    fill: "blue",
  });
var xLine = chart.append("g")
  .call(xAxis)
  .attr({
    class: "axis xAxis",
    transform: "translate(0," + height + ")",
  })
  .selectAll("text")
  .style("text-anchor", "end")
  .attr({
    dx: "-.8em",
    dy: ".25em",
    transform: "rotate(-65)"
  })
  .append("text") //not appearing
  .attr({
    class: "xTitle",
    x: width / 2,
    y: margin.bottom - 5
  })
  .text("Companies");
var yLine = chart.append("g")
  .call(yAxis)
  .attr({
    class: "axis yAxis"
  })
  .append("text")
  .attr({
    x: -height / 2,
    y: -margin.left,
    "dy": ".71em",
    transform: "rotate(-90)"
  })
  .text("Number of non-monetary rewards offered");

function type(d) {
  d.nonMonetary = +d.nonMonetary;
  d.monetary = +d.monetary; // coerce to number
  return d;
}