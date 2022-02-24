import React from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts'; 
import "./hchart.css"

const Demo = () => {
    const options = {
        chart: {
            backgroundColor: null,
            borderWidth: 0,
            type: 'area',
            margin: [2, 0, 2, 0],
            width: 140,
            height: 50,
            style: {
              overflow: 'visible'
            }
        },
        title: {
          text: ""
        },
        credits: {
            enabled: false
          },
          xAxis: {
            labels: {
              enabled: false
            },
            title: {
              text: null
            },
            startOnTick: false,
            endOnTick: false,
            tickPositions: []
          },
          yAxis: {
            endOnTick: false,
            startOnTick: false,
            labels: {
              enabled: false
            },
            title: {
              text: null
            },
            tickPositions: [0],
            plotLines: [
                {
                    color: "#0A9954",
                    dashStyle: 'longdash', 
                    visible: false,
                    value: 10, 
                    width: 2.2 
                }]
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            series: {
                lineWidth: 4,
                color: "#1bc8aa",
                fillColor: {
                    linearGradient: [0, 0, 0, 55],
                    stops: [
                        [0, '#1bc8aa'],
                        [1, '#f3fbfb']
                    ]
                }
            }
        },
        series: [
          {
            marker: {
                enabled: true,
                radius: 2.5
              },
            data: [3, 12, 6, 15, 3, 8]
          }
        ],
      };
    return(
        <div className="Demo">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    )
}

export default Demo;