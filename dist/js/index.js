const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let data = [];

fetch(url)
  .then(response => response.json())
  .then(function(receivedData) {
    data = receivedData.monthlyVariance;
    baseTemp = receivedData.baseTemperature;
    let chartWidth = 1500;
    let chartHeight = 500;

    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    data.map(d => (d.monthNames = months[d.month - 1]));
    let minDate = d3.min(data, d => d.year);
    let maxDate = d3.max(data, d => d.year);

    let tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

    let chart = d3
      .select(".chart")
      .append("svg")
      .attr("id", "chartSVG")
      .attr("width", chartWidth)
      .attr("height", chartHeight);

    let color = d3.scaleSequential(d3.interpolateSpectral);

    let y = d3
      .scaleBand()
      .domain(months)
      .rangeRound([0, chartHeight]);

    let x = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([0, chartWidth]);

    let xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));

    let yAxis = d3.axisLeft(y).scale(y);

    chart
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", (d, i) => x(d.year))
      .attr("y", (d, i) => y(d.monthNames))
      .attr("width", chartWidth / (data.length / 12))
      .attr("height", chartHeight / 12)
      .attr("data-year", d => d.year)
      .attr("data-month", (d, i) => d.month - 1)
      .attr("data-temp", d => baseTemp + d.variance)
      .style("fill", d => color((baseTemp + d.variance) / 10))

      .on("mouseover", d => {
        tooltip.style("opacity", 0.9);
        tooltip.attr("data-year", d.year);
        tooltip
          .html(baseTemp + d.variance + "<br>" + d.monthNames + "<br>" + d.year)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
      })
      .on("mouseout", d => {
        tooltip.style("opacity", 0);
      });

    chart
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + chartHeight + ")")
      .call(xAxis);

    chart
      .append("g")
      .attr("id", "y-axis")
      .attr("transfrom", "translate(0, 0)")
      .call(yAxis);

    chart
      .append("text")
      .attr("id", "description")
      .text("Months")
      .attr("x", -50)
      .attr("y", 210)
      .attr("transform", "rotate(-90 -50 210)");

    let legend = chart
      .selectAll(".legend")
      .data([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("id", "legend")
      .attr("transform", function(d, i) {
        return "translate(80," + i * 15 + ")";
      });

    legend
      .append("rect")
      .attr("x", chartWidth - 30)
      .attr("width", 30)
      .attr("height", 15)
      .style("fill", d => color(d / 10));

    legend
      .append("text")
      .attr("x", chartWidth - 40)
      .attr("y", 12)
      .text((d, i) => d)
      .style("text-anchor", "end");
  });
