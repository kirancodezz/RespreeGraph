import React, { useState } from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import "./HighChart.css"


const HighChrt = () => {
    const [uplineThreshold, setUplineThreshold] = useState("23")
    const options = {
        chart: {
            type: 'spline',
            zoomType: 'x',
            events: {
                load: function() {
                    const chart = this;
                    const data = chart.series[0].data;
                    data.map((element) => {
                        if(element.y <= 18 ){
                            element.update({
                                plotLines: [{
                                    color: '#FF0000',
                                    width: 2,
                                    value: 5
                                }],
                                color: '#F3857C',
                                marker: {
                                    radius: 4+(100 * element.y) / 200
                                }
                                })
                        } else if(element.y <= 24){
                            element.update({
                                color: '#23BCD2',
                                marker: {
                                    radius: 8
                                }
                                })
                        } else {
                            element.update({
                                color: '#FFB359',
                                marker: {
                                    radius: (100 * element.y) / 200
                                }
                                })
                        }
                    })
                }
            }
        },
        plotOptions: {
            line: {
                dataLables: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        xAxis: {
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            tickLength: 10,
            tickWidth: 2,
            categories: [
            "2022-01-08",
            "2022-01-09",
            "2022-01-10",
            "2022-01-11",
            "2022-01-12",
            "2022-01-13",
            "2022-01-14",
            "2022-01-15",
            "2022-01-16",
            "2022-01-17"],
        },
        title:{
            text:''
        },
        yAxis: {
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            tickLength: 10,
            tickWidth: 2,
            plotLines: [
                {
                    color: '#0A9954', 
                    dashStyle: 'longdash', 
                    value: 19, 
                    width: 3 
                },
                {
                    color: '#8EA8CF', 
                    dashStyle: 'long', 
                    value: 17, 
                    width: 3
                },
                {
                    color: '#8EA8CF', 
                    dashStyle: 'long', 
                    value: uplineThreshold, 
                    width: 3 
                }
            ],
            plotBands: [
                {
                    color: '#FFD3D266',
                    from: "35",
                    to: "30"
                },
                {
                    color: '#FFE8CF',
                    from: "30",
                    to: "25"
                },
                {
                    color: '#FFD3D266',
                    from: "6",
                    to: "9"
                },
                {
                    color: '#FFE8CF',
                    from: "5",
                    to: "6"
                }
                ],
            title: "Respiratory",
        },

        //18 -> danger, 20-30 -> normal, 30 -> amber//
        series: [{
            color: '#23BCD2',
            lineWidth: 4,
            type: 'areaspline',
            name: "Resp",
            data: [ 23,10,20,13,27,32,26,17,25,26 ],
            fillColor: 'transparent',
            threshold: uplineThreshold,
            zones: [
                {
                    value: uplineThreshold,
                    fillColor: 'transparent',
                },
                {
                    value: 32,
                    fillColor: '#D2E7FF80',
                }
        ]
        }
    ],
            
    }
    
    return(
        <div>
            <div className="graphControlsContainer">
                <div className="controlsElements">
                    <h3>Respiratory Rate</h3>
                    <div className="elementsValues">
                        <p className="label">Latest</p><p className="labelValue">150.80</p>
                        <p className="minusPlusValue"><span>&#177;</span>10</p>
                    </div>
                </div>

                <div className="rightControls">
                    <div className="controlsElements baslineControl">
                        <p className="headerLabel">Baseline <br/> value</p>
                        <input type="text" className="baseLineValue" value="100.56" />
                        <div className="typeSelector">
                        <label className="selectType bottomMargin"><p>Manual</p>
                            <input type="radio" name="radio" />
                            <span className="checkmark"></span>
                        </label> 
                        <label className="selectType"><p>Computed</p>
                            <input type="radio" name="radio" checked />
                            <span className="checkmark"></span>
                        </label>
                        </div>
                    </div>
                    <div className="controlsElements">
                    <h3>Respiratory Rate</h3>
                    <div className="elementsValues">
                        <p className="label">Latest</p><p className="labelValue">150.80</p>
                        <p className="minusPlusValue"><span>&#177;</span>10</p>
                    </div>
                </div>
                </div>
            </div>
                <HighchartsReact highcharts={Highcharts} options={options}>
            </HighchartsReact>
        </div>
    )
}


export default HighChrt;