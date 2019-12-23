// Define SVG attributes
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;
var margin = { top: 20, right: 40, bottom: 120, left: 100 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG object
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append an SVG group
var chart = svg.append("g");

// Read in data from the CSV file
d3.csv("/static/data/age_employed.csv", function (err, myData) {
  console.log("/static/data/age_employed.csv")

  if (err) throw err;

  myData.forEach(function (data) {
    data.mo_age = Number(data.mo_age);
    data.mo_employed = Number(data.mo_employed);
    data.ks_age = Number(data.ks_age);
    data.ks_employed = Number(data.ks_employed);
  });

  console.log(myData);

  // Scatter plot X & Y axis computation
  var yScale = d3.scaleLinear().range([height, 0]);
  var xScale = d3.scaleLinear().range([0, width]);

  // Create scaled X and Y axis
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Column's minimum and maximum values in data.csv
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // Function to identify the minimum and maximum values for X-axis
  function findMinAndMax_X(dataColumnX) {
    xMin = d3.min(myData, function (data) {
      return Number(data[dataColumnX]) * 0.4;
    });

    xMax = d3.max(myData, function (data) {
      return Number(data[dataColumnX]) * 1.1;
    });
  }

  // Function to identify the minimum and maximum values for Y-axis
  function findMinAndMax_Y(dataColumnY) {
    yMin = d3.min(myData, function (data) {
      return Number(data[dataColumnY]) * 0.09;
    });

    yMax = d3.max(myData, function (data) {
      return Number(data[dataColumnY]) * 1.05;
    });
  }

  // Default label for X-axis is 'poverty and for Y-axis is 'obese' 
  // Another axis can be assigned to the variable during an onclick event.
  var currentAxisLabelX = "mo_age";

  var currentAxisLabelY = "mo_employed";

  var state_abbr = "MO";

  writeAnalysis(currentAxisLabelY);

  // Find the minimum and maximum values for X-axis and Y-axis
  findMinAndMax_X(currentAxisLabelX);
  findMinAndMax_Y(currentAxisLabelY);

  // Scatter plot X & Y axis computation
  xScale.domain([xMin, xMax]);
  yScale.domain([yMin, yMax]);

  // Tool Tip box to show state, X stats, and Y stats
  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    // Define position
    .offset([80, -60])
    // The html() method allows mix of JS and HTML in callback function
    .html(function (data) {
      var data_X = Number(data[currentAxisLabelX]);
      var data_Y = Number(data[currentAxisLabelY]);

      return state_abbr + "<hr>" + currentAxisLabelX + ": " + data_X + "<br>" + currentAxisLabelY + ": " + data_Y;
    });

  // Create tooltip
  chart.call(toolTip);

  // Append the circles for each row of data
  chart
    .selectAll("circle")
    .data(myData)
    .enter()
    .append("circle")
    .attr("cx", function (data, index) {
      return xScale(Number(data[currentAxisLabelX]));
    })
    .attr("cy", function (data, index) {
      return yScale(Number(data[currentAxisLabelY]));
    })
    .attr("r", "12")
    .attr("fill", "lightblue")
    // Both circle and text instances have mouseover & mouseout event handlers
    .on("mouseover", function (data) {
      toolTip.show(data)
    })
    .on("mouseout", function (data) {
      toolTip.hide(data)
    });

  // Apply state abbreviation on circles
  chart
    .selectAll("text")
    .data(myData)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("class", "stateAbbr")
    .style("fill", "black")
    .style("font", "10px sans-serif")
    .style("font-weight", "bold")
    .text(state_abbr)
    .on("mouseover", function (data) {
      toolTip.show(data)
    })
    .on("mouseout", function (data) {
      toolTip.hide(data)
    })
    .attr("x", function (data, index) {
      return xScale(Number(data[currentAxisLabelX]));
    })
    .attr("y", function (data, index) {
      return yScale(Number(data[currentAxisLabelY])) + 4;
    });

  // Append an SVG group for the x-axis, then display X-axis
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    // The class name assigned here will be used for transition effects
    .attr("class", "x-axis")
    .call(xAxis);

  // Append a group for y-axis, then display Y-axis
  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  // Append y-axis label
  // chart
  //   .append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left + 40)
  //   .attr("x", 0 - height / 2)
  //   .attr("dy", "1em")
  //   .attr("class", "axis-text-Y inactive")
  //   .attr("data-axis-name-Y", "healthcare")
  //   .text("Lacks Healthcare (%)");

  // chart
  //   .append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left + 20)
  //   .attr("x", 0 - height / 2)
  //   .attr("dy", "1em")
  //   .attr("class", "axis-text-Y inactive")
  //   .attr("data-axis-name-Y", "smokes")
  //   .text("Smokes (%)");

  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text-Y active")
    .attr("data-axis-name-Y", "mo_employed")
    .text("Employed");

  // Append x-axis labels
  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .attr("class", "axis-text-X active")
    .attr("data-axis-name-X", "mo_age")
    .text("Employed ages in Mossouri");

  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 40) + ")"
    )
    .attr("class", "axis-text-X inactive")
    .attr("data-axis-name-X", "ks_age")
    .text("Employed ages in Kansas");

  // Function to change the active/inactive on X-axis
  function labelChange_X(clickedAxis_X) {
    d3
      .selectAll(".axis-text-X")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    clickedAxis_X.classed("inactive", false).classed("active", true);
    writeAnalysis(currentAxisLabelY);
  }

  // Mouse click on a lable on X-axis
  d3.selectAll(".axis-text-X").on("click", function () {
    // Assign a variable to current axis
    var clickedSelection_X = d3.select(this);
    // "true" or "false" based on whether the axis is currently selected
    var isClickedSelectionInactive = clickedSelection_X.classed("inactive");

    if (isClickedSelectionInactive) {
      // Assign the clicked axis to the variable currentAxisLabelX
      currentAxisLabelX = clickedSelection_X.attr("data-axis-name-X");
      if (currentAxisLabelX == "mo_age") {
        state_abbr = "MO";
      }
      else {
        state_abbr = "KS";
      }

      // Call findMinAndMax() to define the min and max domain values.
      findMinAndMax_X(currentAxisLabelX);
      // Set the domain for the x-axis
      xScale.domain([xMin, xMax]);
      // Create a transition effect for the x-axis
      svg
        .select(".x-axis")
        .transition()
        .duration(1800)
        .call(xAxis);

      // Update location of the circles
      d3.selectAll("circle").each(function () {
        d3
          .select(this)
          .transition()
          .attr("cx", function (data, index) {
            return xScale(Number(data[currentAxisLabelX]));
          })
          .duration(1800);
      });

      d3.selectAll(".stateAbbr").each(function () {
        d3
          .select(this)
          .transition()
          .attr("x", function (data, index) {
            return xScale(Number(data[currentAxisLabelX]));
          })
          .duration(1800);
      });

      // Change the status of the X-axes
      labelChange_X(clickedSelection_X);
    }

    // Y-axis here
    console.log(currentAxisLabelX);
    if (currentAxisLabelX == "mo_age") {
      currentAxisLabelY = "mo_employed";
      state_abbr = "MO";
    }
    else {
      currentAxisLabelY = "ks_employed";
      state_abbr = "KS";
    }
    console.log(currentAxisLabelY);
    console.log(state_abbr);
    // Call findMinAndMax() to define the min and max domain values.
    findMinAndMax_Y(currentAxisLabelY);
    // Set the domain for the Y-axis
    yScale.domain([yMin, yMax]);
    // Create a transition effect for the Y-axis
    svg
      .select(".y-axis")
      .transition()
      .duration(1800)
      .call(yAxis);

    // Update location of the circles
    d3.selectAll("circle").each(function () {
      d3
        .select(this)
        .transition()
        // .ease(d3.easeBounce)
        .attr("cy", function (data, index) {
          return yScale(Number(data[currentAxisLabelY]));
        })
        .duration(1800);
    });

    d3.selectAll(".stateAbbr").each(function () {
      d3
        .select(this)
        .transition()
        .text(state_abbr)
        .attr("y", function (data, index) {
          return yScale(Number(data[currentAxisLabelY]));
        })
        .duration(1800);
    });

    // Change the status of the axes. See above for more info on this function.
    //labelChange_Y(clickedSelection_X);
  });

  // Function to change the active/inactive on Y-axis
  function labelChange_Y(clickedAxis_Y) {
    d3
      .selectAll(".axis-text-Y")
      .filter(".active")
      // An alternative to .attr("class", <className>) method. Used to toggle classes.
      .classed("active", false)
      .classed("inactive", true);

    clickedAxis_Y.classed("inactive", false).classed("active", true);
    writeAnalysis(currentAxisLabelY);
  }

  // Mouse click on a lable on Y-axis
  d3.selectAll(".axis-text-Y").on("click", function () {
    // Assign a variable to current axis
    var clickedSelection_Y = d3.select(this);
    // "true" or "false" based on whether the axis is currently selected
    var isClickedSelectionInactive_Y = clickedSelection_Y.classed("inactive");

    if (isClickedSelectionInactive_Y) {
      // Assign the clicked axis to the variable currentAxisLabelX
      currentAxisLabelY = clickedSelection_Y.attr("data-axis-name-Y");
      // Call findMinAndMax() to define the min and max domain values.
      findMinAndMax_Y(currentAxisLabelY);
      // Set the domain for the Y-axis
      yScale.domain([yMin, yMax]);
      // Create a transition effect for the Y-axis
      svg
        .select(".y-axis")
        .transition()
        .duration(1800)
        .call(yAxis);

      // Update location of the circles
      d3.selectAll("circle").each(function () {
        d3
          .select(this)
          .transition()
          // .ease(d3.easeBounce)
          .attr("cy", function (data, index) {
            return yScale(Number(data[currentAxisLabelY]));
          })
          .duration(1800);
      });

      d3.selectAll(".stateAbbr").each(function () {
        d3
          .select(this)
          .transition()
          .attr("y", function (data, index) {
            return yScale(Number(data[currentAxisLabelY]));
          })
          .duration(1800);
      });

      // Change the status of the axes. See above for more info on this function.
      labelChange_Y(clickedSelection_Y);
    }
  });

});

function writeAnalysis(yAxis) {
  var analysisText = parent.document.getElementById('analysis');

  var responses = "The top five states with the highest employment for bachelor's degree: " +
    "California, Texas, Florida, New York, and Illinois<br>" +
    "The top five states with the highest employment for master's degree: " +
    "California, Texas, New York, Florida, and Illinois<br>" +
    "The top five states with the highest employment for doctoral degree: " +
    "California, New York, Texas, Florida, and Massachusetts<br>" +
    "<br>The future studies:<br>" +
    "1. What educational fields or majors are in demand by employers, or vice versa?<br>" +
    "2. Does gender play a role in terms of employed or unemployed<br>";

  analysisText.innerHTML = responses;
};
