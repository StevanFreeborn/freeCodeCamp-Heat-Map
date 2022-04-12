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
        .attr("viewBox", `0 0 ${width + 140} ${height + 100}`);

        // build xaxis
        const xScale = d3.scaleBand()
        .domain(data.monthlyVariance.map(d => d.year))
        .range([0, width]);

        const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickValues(
            // tick values will only be years
            // divisible by 10
            xScale.domain().filter(year => year % 10 === 0)
        )
        .tickFormat(year => {
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
        .attr("transform", "translate(70,450)")
        .call(xAxis);

        // build y-axis
        const months = [1,2,3,4,5,6,7,8,9,10,11,12]

        const yScale = d3.scaleBand()
        .domain(months)
        .range([0,height]);

        const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickValues(yScale.domain())
        .tickFormat(month => {
            // each month tick value will be formatted
            // as a date object displaying only the
            // full month name.
            let date = new Date(0);
            date.setUTCMonth(month);
            let format = d3.timeFormat("%B");
            return format(date);
        })
        .tickSize(10,1)
        .tickSizeOuter(0);

        svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(70,50)")
        .call(yAxis);
        
        // create colors object 
        const colors = [
            {
                color: "#d72f27",
            },
            {
                color: "#f46d43",
            },
            {
                color: "#fdae61",
            },
            {
                color: "#fee090",
            },
            {
                color: "#ffffbf",
            },
            {
                color: "#e0f3f8",
            },
            {
                color: "#abd9e9",
            },
        ];

        // calculate and add step values to each color
        const temps = data.monthlyVariance.map(d => d.variance + data.baseTemperature);
        const maxTemp = Math.max(...temps);
        const minTemp = Math.min(...temps);

        const step = (maxTemp - minTemp)/colors.length;

        colors.forEach((color,i) => color.step = maxTemp - (step * i))
        
        // add cells
        svg.selectAll("rect")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.year) + 70)
        .attr("y", d => yScale(d.month) + 50)
        .attr("width", d => xScale.bandwidth(d.year))
        .attr("height", d => yScale.bandwidth(d.month))
        .attr("class", "cell")
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d=> d.year)
        .attr("data-temp", d => d.variance + data.baseTemperature)
        .attr("fill", d => {
            let temp = d.variance + data.baseTemperature;
            for(i = 0; i < colors.length; i++)
                if(temp > colors[i].step) 
                    return colors[i].color;
        });
    }
})