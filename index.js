const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const width = 800;
const height = 600;
const padding = 60;

let svg = d3.select("#canvas")
            .attr("width", width)
            .attr("height", height);

d3.json(url).then(data => {
    const gdpData = data.data;
    const dates = gdpData.map(d => new Date(d[0]));
    
    const xScale = d3.scaleTime()
                     .domain([d3.min(dates), d3.max(dates)])
                     .range([padding, width - padding]);
    
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(gdpData, d => d[1])])
                     .range([height - padding, padding]);

    const tooltip = d3.select("body")
                      .append("div")
                      .attr("id", "tooltip")
                      .style("visibility", "hidden");

    svg.selectAll("rect")
       .data(gdpData)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("width", (width - 2 * padding) / gdpData.length)
       .attr("x", (d, i) => xScale(dates[i]))
       .attr("y", d => yScale(d[1]))
       .attr("height", d => height - padding - yScale(d[1]))
       .attr("fill", "#032AA5")
       .attr("data-date", d => d[0])
       .attr("data-gdp", d => d[1])
       .on("mouseover", (event, d) => {
            tooltip.transition().style("visibility", "visible");
            tooltip.text(`Year: ${new Date(d[0]).getUTCFullYear()}, GDP: $${d[1]} Billion`)
                   .attr("data-date", d[0])
                   .style("left", `${event.pageX + 5}px`)
                   .style("top", `${event.pageY - 28}px`);
       })
       .on("mouseout", () => tooltip.style("visibility", "hidden"));

    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
       .attr("id", "x-axis")
       .attr("transform", `translate(0, ${height - padding})`)
       .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
       .attr("id", "y-axis")
       .attr("transform", `translate(${padding}, 0)`)
       .call(yAxis);
});
