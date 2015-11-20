//calculate total birds for each state
var statesTotal = [];
for (i = 0; i < uniqueStates.length; i++) {
    stateTotal = 0
    for (j = 0; j < birdFlu.length; j++) {
        if (uniqueStates[i] == birdFlu[j].State) {
            if (birdFlu[j]["Flock size"] == "pending") {
                console.log(birdFlu[j].State + " has a pending flock.")
            } else {
                stateTotal += birdFlu[j]["Flock size"]
            };
        }

    }
    statesTotal.push({
        state: uniqueStates[i],
        total: stateTotal
    });
}
//smallest to largest infected flocks
statesTotal.sort(function (obj1, obj2) {
    return obj1.total - obj2.total;
});
var margin = {
        top: 20,
        right: 30,
        bottom: 30,
        left: 100,
    },
    width = 960 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom,
    barWidth = width / statesTotal.length;
//change attributes of chart
var chart = d3.select(".overviewChart")
    .attr({
        //preserveAspectRatio: "xMinYMin slice",
        //viewBox: "0 0" + " " + 960 + " " + 1000,
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    })
    .append("g")
    .attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });
var tipTotal = d3.tip()
    .attr({
        class: "d3-tip"
    })
    .offset([0, 0])
    .html(function (d) {
        return "<strong>Flock size:</strong> <span style='color:#39E8BB'>" + d.total + "</span>";
    });
chart.call(tipTotal);
//make rectangles
var yScale = d3.scale.linear()
    .domain([0, d3.max(statesTotal, function (d) {
        console.log(d.total);
        return d.total;
    })])
    .range([height, 0]);
var xScale = d3.scale.ordinal()
    .domain(statesTotal.map(function (d) {
        return d.state;
    }))
    .rangeRoundBands([0, width], 0.3);
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var bar = chart.selectAll("g")
    .data(statesTotal)
    .enter().append("g");
//add rectangles
bar.append("rect")
    .attr({
        class: "flockSize",
        y: function (d) {
            return yScale(d.total);
        },
        x: function (d, i) {
            return xScale(i);
        },
        width: xScale.rangeBand(),
        height: function (d) {
            return height - yScale(d.total);
        },
        fill: "#FF514B",
        transform: function (d) {
            return "translate(" + xScale(d.state) + ",0)";
        },
    })
    .on('mouseover', function (d) {
        tipTotal.show(d);
    });
//size labels
var yLine = chart.append('g')
    .call(yAxis)
    .attr({
        class: "axis yAxis"
    })
    .selectAll("text")
    .style("text-anchor", "end")
    .attr({
        dx: "-.8em",
        dy: ".25em"
    })
    .append("text") //not appearing
    .attr({
        class: "yTitle",
        x: width / 2,
        y: margin.bottom - 5
    });
var xLine = chart.append("g")
    .call(xAxis)
    .attr({
        class: "axis yAxis",
        transform: "translate(0," + height + ")"
    })
    .append("text")
    .attr({
        x: width / 2,
        y: margin.bottom - 5
    });

function type(d) {
    d.total = +d.total;
    return d;
}