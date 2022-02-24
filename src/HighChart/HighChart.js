import React, { useState, useEffect, useMemo } from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import "./HighChart.css";
import "./hchart.css";
import Graph from "./Graph.component";
import useGraphDataFormatter from "../Graph/hooks/useGraphDataFormatter";


const HighChrt = () => {
    const [chartData, setChartData]  = useState({})
    const [deviationFromBaseline, setDeviationFromBaseline] = useState(10)
    const [baseLineValue, setBaselineValue] = useState(0);
    const [baselineDeviationValues, setBaselineDeviationValues] = useState(0);
    const [yAxisMax, setYAxisMax] = useState(0);
    const [yAxisMin, setYAxisMin] = useState(0);
    const [isCalculatedValueShown, setIsCalculatedValueShown] = useState(true)
    const [baseLineUpperDeviation, setBaseLineUpperDeviation] = useState(true)
    const [baseLineLowerDeveiation, setBaseLineLowerDeveiation] = useState(true)
    const [graphComponentsCheckbox, setGraphComponentCheckbox] = useState({
        baseline: true,
        baselineDeviation: true,
        amberThreshold: true,
        redThreshold: true,
        deviationIndicator: true,
        thresholdIndicator: true,
        standardDeviation: true,
    })

    const { formatGraphData, calculateGraphAlertBands } = useGraphDataFormatter()
    const alertBands = calculateGraphAlertBands(({
            highRed: "31",
            highAmber: "24",
            lowAmber: "12",
            lowRed: "10",
            yAxisMax: yAxisMax,
            yAxisMin: yAxisMin
    }))

    const { baseline, baselineDeviation, amberThreshold, redThreshold, thresholdIndicator, standardDeviation, deviationIndicator } = graphComponentsCheckbox
    const onGraphCheckboxClicked = (checkbox, boolean) => {
        setGraphComponentCheckbox({ ...graphComponentsCheckbox, [checkbox]: boolean })
    }

    HC_more(Highcharts);
    useEffect(() => {
        fetch("https://u6wawzlr6h.execute-api.ap-southeast-1.amazonaws.com/respiree-api/dev/query/trends?start_datetime=2022-01-22T05:32:33&stop_datetime=2022-02-21T05:32:33&id=4&resolution=daily")
        .then(res => res.json())
        .then(
            (result) => {
                setChartData(result?.response)
                formatGraphData(result?.response)
            }
        )
    },[formatGraphData])

const graphContainers = useMemo(() => {
        return [
            {
                name: "RR", 
                data: formatGraphData({
                    timestamps: chartData?.metrics?.listdate,
                    vitals: chartData?.metrics?.["RR"],
                    deviations: chartData?.metrics_SD?.["RR"]
                }) 
            },
        ]
    },[chartData, formatGraphData]) 
    const graphData = formatGraphData({
        timestamps: [1497398400000,1497484800000, 1497571200000, 1497830400000, 1497916800000, 1498435200000, 1498521600000, 1498608000000, 1498780800000, 1499040000000, 1499126400000, 1499212800000,1499299200000, 1499817600024, 1499904000000, 1500249600000, 1500940800000, 1501027200000, 1501113600000, 1501200000000, 1501459200000, 1501545600000, 1501632000000, 1501718400000, 1501804800000, 1502064000000, 1502150400000, 1502236800000, 1502323200000, 1502409600000, 1502668800000, 1502755200000,],
        vitals: [7, 10 ,13 ,20 ,22 ,30 ,31 ,32 ,32.5 ,30 ,28 ,26 ,24 ,10 ,9 ,11 ,28 ,29 ,30 ,31 ,32 ,31 ,30 ,29 ,28 ,20 ,18 ,16 ,14 ,13 ,13 ,15],
        heartRate: [12, 15 ,18 ,24 ,26 ,34 ,35 ,36 ,36.5 ,34 ,32 ,30 ,28 ,14 ,13 ,15 ,32 ,33 ,34 ,35 ,36 ,35 ,34 ,33 ,32 ,24 ,22 ,20 ,18 ,17 ,18 ,20],
        deviations: [3, 4, 5, 6, 3, 5, 6, 4, 3, 2, 4, 5, 2,  1, 3, 4, 4, 1, 2, 3, 4, 5, 3, 2, 4, 3, 4, 5, 2, 4, 2, 4]
    })
    // const graphDataWithDeviation = graphContainers.formattedVitals;
    const lineGraphData = graphContainers[0].data.lineChartValues;
    const lineChartValuesOnly = graphContainers[0].data.lineChartValuesOnly;
    const medianValue = graphContainers[0].data.median
    const deviationGraph = graphContainers[0].data?.deviationGraph
    const heartRateData = graphData.heartrateValues;

    // Find Standard deviation
    const standardDeviationCalulator = (arr) => {
        let mean = arr.reduce((acc, curr) => {
            return acc + curr
        }, 0) / arr.length;
        arr = arr.map((k) => {
            return (k - mean) ** 2
        })
        let sum = arr.reduce((acc, curr) => acc + curr, 0);
        return Math.sqrt(sum / arr.length)
    }

    const deviationData = lineGraphData?.map((value) => {
        return [value[0], value[1] + standardDeviationCalulator(lineChartValuesOnly), value[1] - standardDeviationCalulator(lineChartValuesOnly)]
    })
    useEffect(() => {
        if (isCalculatedValueShown === true) {
            setBaselineValue(medianValue)
        }
    }, [isCalculatedValueShown, medianValue])

    useEffect(() => {
        setBaselineDeviationValues((baseLineValue / 100) * deviationFromBaseline)
    }, [deviationFromBaseline, baseLineValue])

    const options = {
        chart: {
            title: "",
            type: 'spline',
            zoomType: 'x',
            animation: false,
            scrollablePlotArea: {
                minWidth: 500,
                scrollPositionX: 1
            },
            events: {
                redraw: function () {
                    const chart = this;
                    setYAxisMax(chart.axes[1].max)
                    setYAxisMin(chart.axes[1].min)
                    const series = [chart.series[0]];      
                    chart.myCustomLines = [];              
                    series?.forEach(function (series, j) {
                        series.data?.forEach(function (point, i) {
                            chart.myCustomLine = chart?.renderer
                                .path([
                                    "M",
                                    chart.plotLeft + point.plotX,
                                    chart.plotTop + point.plotY,
                                    "L",
                                    chart.plotLeft + point.plotX,
                                    chart.plotSizeY + chart.plotTop
                                ])
                                .attr({
                                    "stroke-width": 3,
                                    zIndex: 4,
                                    stroke: point.y < 8 || point.y > 31 ? "#F3857C" : point.y >= (28 && point.y <= 31) || point.y >= (24 && point.y <= 25) ? "#FFB359" : "transparent",
                                    display: false
                                })
                                .add()
                            chart.myCustomLines.push(chart.myCustomLine);
                        });
                    });
                    // const data = chart.series[0].data;
                    // data.map((element) => {
                    //     if (element.y > 8 || element.y < 31) {
                    //         element.update({
                    //             color: '#F3857C',
                    //             className: "markerShadow",
                    //             marker: {
                    //                 zIndex: 100,
                    //                 // radius: 4+(100 * element.y) / 200
                    //                 radius: 9
                    //             }
                    //         })
                    //     } 
                    // })
                },
                load: async function () {
                    const chart =  this;           
                    const data = await chart.series[0].data;
                    setTimeout(() => {
                        const data = chart.series[0].data;
                    data.forEach((element) => {
                        if (element.y > 8 || element.y < 31) {
                            element.update({
                                color: '#F3857C',
                                className: "markerShadow",
                                marker: {
                                    zIndex: 100,
                                    // radius: 4+(100 * element.y) / 200
                                    radius: 9
                                }
                            })
                        } else if (element.y >= (28 && element.y <= 31) || (element.y >= 8 && element.y) <= 12) {
                            element.update({
                                color: '#FFB359',
                                className: "markerShadow",
                                marker: {
                                    zIndex: 10,
                                    radius: 9
                                }
                            })
                        } else {
                            element.update({
                                color: '#23BCD2',
                                className: "markerShadow",
                                marker: {
                                    // radius: (100 * element.y) / 200
                                    zIndex: 10,
                                    radius: 9
                                }
                            })
                        }
                    })
                    },300)
                    
    
                    
                },
                render: function () {
                    var chart = this,
                        series = [chart.series[0]];
                    series.forEach(function (series, j) {
                        series.data.forEach(function (point, i) {
                            chart.myCustomLines[i]?.attr({
                                d: [
                                    "M",
                                    chart.plotLeft + point.plotX,
                                    chart.plotTop + point.plotY,
                                    "L",
                                    chart.plotLeft + point.plotX,
                                    chart.plotSizeY + chart.plotTop
                                ]
                            })?.attr({
                                "stroke-width": thresholdIndicator ? 4 : 0,
                            });
                        });
                    });
                }
            }
        },
        title: {
            text: ""
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            animation: false,
            line: {
                dataLables: { 
                    enabled: true
                },
                enableMouseTracking: false
            },
        },
        // tooltip: {
        //     formatter: function () {
        //     }
        // },
        xAxis: {
            type: 'datetime',
            gridLineWidth: 0,
            gridLineColor: "white",
            minorGridLineWidth: 0,
            tickLength: 9,
            tickWidth: 1.5,
            lineColor: 'transparent',
            accessibility: {
                rangeDescription: 'Range: Jul 1st 2009 to Jul 31st 2009.'
            },
            labels: {
                align: 'center',
                useHTML: true,
                formatter: function () {
                    const month = Highcharts.dateFormat('%b', this.value);
                    const day = Highcharts.dateFormat('%e', this.value);
                    return `<div class="daydateWrapper"><p class="dayDate" >${month}<br></p><p class="dayStyle">${day}</p></div>`

                }

            },
            tickColor: '#164f57ba',
            plotLines: [{
                color: '#FF0000',
                width: 2,
                value: 3,
                from: 20
            }]
        },
        yAxis: {
            gridLineWidth: 0,
            gridLineColor: "white",
            minorGridLineWidth: 0,
            tickLength: 9,
            tickWidth: 1.5,
            color: "#242637",
            fontSize: "12px",
            min: null  ,
            // max: lowestYaxisValue ,
            tickColor: '#164f57ba',
            title: {
                text: null
            },
            scrollbar: {
                enabled: true,
                showFull: false
            },
            plotLines: [
                {
                    color: baseline ? "#0A9954" : "transparent",
                    dashStyle: 'dash',
                    visible: false,
                    // zIndex: 3,
                    value: baseLineValue,
                    width: 2.5
                },
                {
                    color: baseLineLowerDeveiation && baselineDeviation ? "#8EA8CF" : "transparent",
                    dashStyle: 'long',
                    // zIndex: 3,
                    value: baseLineValue - baselineDeviationValues,
                    width: 2.5
                },
                {
                    color: baseLineUpperDeviation && baselineDeviation ? "#8EA8CF" : "transparent",
                    dashStyle: 'long',
                    shadow: true,
                    className: "plotlineshadow",
                    value: Number(baseLineValue) + Number(baselineDeviationValues),
                    // zIndex: 3,
                    width: 2.5
                }
            ], plotBands: alertBands
        },
        // tooltip: {
        //     formatter() {
        //         const pointData = graphDataWithDeviation.find(row => row.timestamp === this.point.x)
        //         return Highcharts.dateFormat('%A, %d %b %Y %H:%M', pointData.timestamp) + '<br><br>' +
        //             '<b>Temprature: </b>' + pointData.value + '<br>' +
        //             '<b>Deviation: </b>' + '<span>&#177;</span>' + pointData.deviation + '<br>'
        //     }
        // },
        series: [{
            name: 'Temperature',
            color: '#1499AD',
            type: 'areaspline',
            data: lineGraphData,
            zIndex: 20,
            lineWidth: 3,
            fillColor: 'transparent',
            threshold: Number(baseLineValue) + Number(baselineDeviationValues),
            zones: [
                {
                    value: Number(baseLineValue) + Number(baselineDeviationValues),
                    fillColor: 'transparent',
                },
                {
                    value: 32,
                    fillColor: deviationIndicator ? "#BDDBFF" : "transparent",
                }
            ]
        }, {
            name: 'Range',
            data: deviationGraph,
            zIndex: 0,
            visible: standardDeviation,
            type: 'areasplinerange',
            lineWidth: 0,
            linkedTo: ':previous',
            color: "#e3e2e275",
            tooltip: {
                enabled: false
            },
            marker: {
                enabled: false
            },
            
        }, 
        {
            name: 'Heart Rate',
            data: heartRateData,
            zIndex: 0,
            type: 'spline',
            color: "#22bcd2",
            visible: false
        },
        {
            name: 'Spo2',
            data: deviationData,
            zIndex: 0,
            type: 'spline',
            color: "#f2857c",
            visible: false
        }
        ],
    }

    return (
        <Graph
            HighchartsReact={HighchartsReact}
            Highcharts={Highcharts}
            options={options}
            baseline={baseline}
            baselineDeviation={baselineDeviation}
            amberThreshold={amberThreshold}
            redThreshold={redThreshold}
            thresholdIndicator={thresholdIndicator}
            standardDeviation={standardDeviation}
            deviationIndicator={deviationIndicator}
            onGraphCheckboxClicked={onGraphCheckboxClicked}
            baseLineValue={baseLineValue}
            setBaselineValue={setBaselineValue}
            setIsCalculatedValueShown={setIsCalculatedValueShown}
            isCalculatedValueShown={isCalculatedValueShown}
            baseLineUpperDeviation={baseLineUpperDeviation}
            setBaseLineUpperDeviation={setBaseLineUpperDeviation}
            baseLineLowerDeveiation={baseLineLowerDeveiation}
            setBaseLineLowerDeveiation={setBaseLineLowerDeveiation}
            deviationFromBaseline={deviationFromBaseline}
            setDeviationFromBaseline={setDeviationFromBaseline}
        />
    )
}

export default HighChrt;




