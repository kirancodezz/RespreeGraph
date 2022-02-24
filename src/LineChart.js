import React, { useEffect } from "react";
import "./LineChart.css"
import * as d3 from "d3"


const LineChart = () => {
    useEffect(() => {
        // Generate random data for our line where x is [0,15) and y is between 0 and 100
           let lineData = []
           for(let i = 0; i < 40; i++) {
              lineData.push({x: i + 1, y: Math.round(Math.random() * 100)})
           }
      
           // Create our scales to map our data values(domain) to coordinate values(range)
           let xScale = d3.scaleLinear().domain([0,50]).range([0, 600])
           let yScale = d3.scaleLinear().domain([0,100]).range([300, 0]) // Since the SVG y starts at the top, we are inverting the 0 and 300.
           
           // Generate a path with D3 based on the scaled data values
           let line = d3.line()
            .x(dt => xScale(dt.x))
            .y(dt => yScale(dt.y))
            .curve(d3.curveBasis);
           
           // Generate the x and y Axis based on these scales
           let xAxis = d3.axisBottom(xScale)
           let yAxis = d3.axisLeft(yScale)
           
           // Create the horizontal base line
           d3.select('#LineChart').selectAll('path').datum(lineData) // Bind our data to the path element
          .attr('d', d3.line().x(dt => xScale(dt.x)) // Set the path to our line function, but where x is the corresponding x
          .y(yScale(0))).attr("class", "line") // Set the y to always be 0 and set stroke and fill color
            .attr('d', line) // Set the path to our line variable (Which corresponds the actual path of the data)
           
           // Append the Axis to our LineChart svg
           d3.select('#LineChart').append("g")
           .attr("transform", "translate(0, " + 300 + ")").call(xAxis)
      
           d3.select('#LineChart').append("g")
           .attr("transform", "translate(0, 0)").call(yAxis)
      }, [])    
    return(
        <div className = "App" >
                <svg id="LineChart" width = {"auto"} height = {350}><path/></svg>
        </div>
    )
}

export default LineChart;