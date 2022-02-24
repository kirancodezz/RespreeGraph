import React, { useEffect } from "react";
import "./chart.css"
import * as d3 from "d3"

const Chart = () => {
    useEffect(() => {

        let lineData = []
        for(let i = 0; i < 40; i++) {
           lineData.push({x: i + 1, y: Math.round(Math.random() * 100)})
        }
        var margin = {top: 0, right: 25, bottom: 20, left: 25}
        var width = 1200 - margin.left - margin.right;
        var height = 40 - margin.top - margin.bottom;
        
        var x = d3.timeDays(new Date(2021, 1, 1), new Date(2021, 12, 1));
        let yScale = d3.scaleLinear().domain([0,100]).range([300, 0])
        // start with 10 ticks
var startTicks = 12;

// zoom function 
var zoom = d3.zoom()
  .on("zoom", (event) => {
  
    var t = event.transform;

    // Change 1: Update only the domain directly with rescaleX
    xScale = t.rescaleX(xScale2); 
      
    var zoomedRangeWidth = xScale.range()[1] - xScale.range()[0];
    var zrw = zoomedRangeWidth.toFixed(4);
    var kAppliedToWidth = kw = t.k * width;
    var kw = kAppliedToWidth.toFixed(4);
    
    // Change 2: Fix zoom ticks to a number, such as 10
    // var zoomTicks = zt = 10
      
    svg.select(".x-axis")
      .call(d3.axisBottom(xScale)
        // .ticks(zt) 
    );

    // var realTicks = rt = xScale.ticks().length;
    // console.log(`zrw: ${zrw}, kw: ${kw}, zt: ${zt}, rt: ${rt}`);
    
    // Change 3: Consider zt when using the tickFormat method
    // console.log(`labels: ${xScale.ticks().map(xScale.tickFormat(zt))}`);
    
  })
  .scaleExtent([1, 50]); 


// x scale
var xScale = d3.scaleTime()
  .domain(d3.extent(x))
  .range([0, width]); 

// x scale copy
var xScale2 = xScale.copy();

// svg
var svg = d3.select("#scale")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .call(zoom) 
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// clippath 
svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("x", 0)
  .attr("width", width)
  .attr("height", height);
    
// x-axis
svg.append("g")
  .attr("class", "x-axis")
  .attr("clip-path", "url(#clip)") 
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale)
    .ticks(startTicks));

    },[])
    return(
        <div>
            <div id="scale"></div>
        </div>
    )
}

export default Chart;