const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

document.addEventListener("DOMContentLoaded", () => {

    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = () => {

        const data = JSON.parse(request.responseText);
        console.log(data);

        const width = 800;
        const height = 400;

        const svg = d3.select(".heat-map")
        .append("svg")
        .attr("id", "heat-map")
        .attr("viewBox", `0 0 ${width + 100} ${height + 100}`);

        // build xaxis
        const xScale = d3.scaleBand()
        .domain(data.monthlyVariance.map((d) => d.year))
        .range([0, width]);

        const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickValues(
            // tick values will only be years
            // divisible by 10
            xScale.domain().filter((year) => year % 10 === 0)
        )
        .tickFormat((year) => {
            // each year tick value will be formatted
            // as a date object displaying only the year.
            let date = new Date(0);
            date.setUTCFullYear(year);
            let format = d3.timeFormat("%Y");
            return format(date);
        })
        .tickSize(10,1)
        .tickSizeOuter(0);

        svg.append('g')
        .attr("id", "x-axis")
        .attr("transform", "translate(50,450)")
        .call(xAxis);

        // build y-axis
        const months = [0,1,2,3,4,5,6,7,8,9,10,11]

        const yScale = d3.scaleBand()
        .domain(months)
        .range([0,height]);

        const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickValues(yScale.domain())
        .tickFormat((month) => {
            // each month tick value will be formatted
            // as a date object displaying only the
            // abbreviated month.
            let date = new Date(0);
            date.setUTCMonth(month);
            let format = d3.timeFormat("%b");
            return format(date);
        })
        .tickSize(10,1)
        .tickSizeOuter(0);

        svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(50,50)")
        .call(yAxis);

    }
})