import React, { useState, useEffect, useMemo } from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import "./HighChart.css";
import "./hchart.css";
import Graph from "./Graph.component";
import useGraphDataFormatter from "../Graph/hooks/useGraphDataFormatter";


const HighChrt = () => {
    const [yAxisMax, setYAxisMax] = useState(0);
    const [yAxisMin, setYAxisMin] = useState(0);
    const [chartData, setChartData] = useState({})
    // const [chartRange, setChartRange] = useState(10)
    const [baseLineValue, setBaselineValue] = useState(0);
    const [dateRange, setDateRange] = useState();
    // const [dateRangeIndex, setDateRangeIndex] = useState(5);
    const [deviationFromBaseline, setDeviationFromBaseline] = useState(10)
    const [baselineDeviationValues, setBaselineDeviationValues] = useState(0);
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
    const { baseline, baselineDeviation, amberThreshold, redThreshold, thresholdIndicator, standardDeviation, deviationIndicator } = graphComponentsCheckbox
    const { formatGraphData, calculateGraphAlertBands } = useGraphDataFormatter()
    
    // TODO: If no value set the value as undefined
    const alertThresholds = {
        highRed: "36",
        highAmber: "30",
        lowAmber: "10",
        lowRed: "4",
        yAxisMax: yAxisMax,
        yAxisMin: yAxisMin,
        amberThreshold: amberThreshold,
        redThreshold: redThreshold
    }
    const alertBands = calculateGraphAlertBands((alertThresholds))
    console.log(alertBands)
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
    }, [formatGraphData])
  
    const graphContainers = useMemo(() => {
        return [
            {
                name: "HR",
                data: formatGraphData({
                    timestamps: chartData?.metrics?.listdate,
                    // vitals: chartData?.metrics?.["RR"], 
                    vitals: [
                        11,
                        10,
                        25,
                        32,
                        24,
                        24,
                        25,
                        38,
                        25,
                        24,
                        2,
                        24,
                        25,
                        33,
                        24,
                        22,
                        4,
                        24,
                        23,
                        39,
                        22,
                        12,
                        25,
                        37,
                        24,
                        15,
                        22,
                        19,
                        6,
                        20
                    ],
                    deviations: chartData?.metrics_SD?.["RR"]
                })
            },
        ]
    }, [chartData, formatGraphData])

    const graphData = formatGraphData({
        timestamps: [1497398400000, 1497484800000, 1497571200000, 1497830400000, 1497916800000, 1498435200000, 1498521600000, 1498608000000, 1498780800000, 1499040000000, 1499126400000, 1499212800000, 1499299200000, 1499817600024, 1499904000000, 1500249600000, 1500940800000, 1501027200000, 1501113600000, 1501200000000, 1501459200000, 1501545600000, 1501632000000, 1501718400000, 1501804800000, 1502064000000, 1502150400000, 1502236800000, 1502323200000, 1502409600000, 1502668800000, 1502755200000,],
        vitals: [7, 10, 13, 20, 22, 30, 31, 32, 32.5, 30, 28, 26, 24, 10, 9, 11, 28, 29, 30, 31, 32, 31, 30, 29, 28, 20, 18, 16, 14, 13, 13, 15],
        heartRate: [12, 15, 18, 24, 26, 34, 35, 36, 36.5, 34, 32, 30, 28, 14, 13, 15, 32, 33, 34, 35, 36, 35, 34, 33, 32, 24, 22, 20, 18, 17, 18, 20],
        deviations: [3, 4, 5, 6, 3, 5, 6, 4, 3, 2, 4, 5, 2, 1, 3, 4, 4, 1, 2, 3, 4, 5, 3, 2, 4, 3, 4, 5, 2, 4, 2, 4]
    })
    const graphDataWithDeviation = graphContainers[0].data.formattedVitals;
    const lineGraphData = graphContainers[0].data.lineChartValues;
    const lineChartValuesOnly = graphContainers[0].data.lineChartValuesOnly;
    const medianValue = graphContainers[0].data.median
    const deviationGraph = graphContainers[0].data?.deviationGraph
    const formattedTimestamp = graphContainers[0].data?.formattedTimestamp
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
        // setDateRange(minimumDateShown)
    }, [deviationFromBaseline, baseLineValue])
    useEffect(() => {
        setDateRange(formattedTimestamp?.[formattedTimestamp?.length - 10])
        // setDateRange(formattedTimestamp?.[dateRangeIndex])
    },[formattedTimestamp, dateRange])
    const options = {
        chart: {
            title: "",
            type: 'spline',
            panning: true,
            zoomType: false,
            pinchType: false,
            scrollablePlotArea: {
                scrollPositionX: 1
              },
            animation: true,
            height: "340",
            events: {
                redraw: function () {
                    const chart = this;
                    setYAxisMax(chart.axes[1].max)
                    setYAxisMin(chart.axes[1].min)
                },
                load: function () {
                    const chart = this;
                    setTimeout(() => {
                        const series = [chart.series?.[0]];
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
                                        class: "customLine",
                                        "stroke-width": 2.2,
                                        zIndex: 4,
                                        stroke: point.y >= alertThresholds.highRed ? "#F3857C" :
                                                    point.y >= alertThresholds.highAmber ? "#FFB359" :
                                                        point.y <= alertThresholds.lowRed ? "#F3857C" :
                                                            point.y <= alertThresholds.lowAmber ? "#FFB359" :
                                                                "transparent",
                                        display: false
                                    })
                                    .add()
                                chart.myCustomLines.push(chart.myCustomLine);
                            });
                        });
                        const data = chart.series[0].data;
                        data.forEach((element) => {
                            element.update({
                                color:
                                    element.y >= alertThresholds.highRed ? "#F3857C" :
                                        element.y >= alertThresholds.highAmber ? "#FFB359" :
                                            element.y <= alertThresholds.lowRed ? "#F3857C" :
                                                element.y <= alertThresholds.lowAmber ? "#FFB359" :
                                                    "#1499AD",
                                className: "markerShadow",
                                marker: {
                                    radius: 9
                                }
                            })
                            console.log(alertThresholds.lowRed)
                        })
                    }, 900)
                },
                render: function () {
                    let chart = this;
                    // chart.renderer
                    // .button("+", 1250, 210, function() {
                    //     setDateRangeIndex(dateRangeIndex + 5 )

                    // })
                    // .attr({
                    //   zIndex: 4,
                    //   className: "zoombutton",
                    // })
                    // .add();

                    // chart.renderer
                    // .button("-", 1300, 210, function() {
                    //     setDateRangeIndex(dateRangeIndex - 5 )  
                    // })
                    // .attr({
                    //   className: "zoombutton",
                    //   zIndex: 4
                    // })
                    // .add();


                    setTimeout(() => {
                        const series = [chart?.series?.[0]];
                        series.forEach(function (series, j) {
                            series?.data?.forEach(function (point, i) {
                                chart?.myCustomLines?.[i]?.attr({
                                    d: [
                                        "M",
                                        chart.plotLeft + point.plotX,
                                        chart.plotTop + point.plotY,
                                        "L",
                                        chart.plotLeft + point.plotX,
                                        chart.plotSizeY + chart.plotTop
                                    ]
                                })?.attr({
                                    "stroke-width": thresholdIndicator ? 3 : 0,
                                });
                            });
                        });
                    }, 50)
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
            enabled: false
        },
        plotOptions: {
            series: {
                stickyTracking: false
            },
            animation: true,
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
            // range: 1,
            min: dateRange,
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
        },
        yAxis: {
            gridLineWidth: 0,
            gridLineColor: "white",
            minorGridLineWidth: 0,
            tickInterval: 10,
            tickLength: 9,
            tickWidth: 1.5,
            labels: {
                style: {
                    color: '#242637',
                    fontSize: "12px",
                }
            },
            min: 0,
            max: 35,
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
                    dashStyle: 'Dash',
                    visible: false,
                    // zIndex: 3,
                    value: baseLineValue,
                    width: 2.5
                },
                {
                    color: baseLineLowerDeveiation && baselineDeviation ? "#8ECFC0" : "transparent",
                    dashStyle: 'long',
                    // zIndex: 3,
                    value: baseLineValue - baselineDeviationValues,
                    width: 2.5
                },
                {
                    color:  redThreshold ? "#FFD3D2" : "transparent",
                    dashStyle: 'long',
                    // zIndex: 3,
                    value: alertThresholds.highRed,
                    width: 2
                },
                {
                    color: amberThreshold ? "#FFE8CF" : "transparent",
                    dashStyle: 'long',
                    // zIndex: 3,
                    value: alertThresholds.highAmber,
                    width: 2
                },
                {
                    color: amberThreshold ? "#FFE8CF" : "transparent",
                    dashStyle: 'long',
                    // zIndex: 3,
                    value: alertThresholds.lowAmber,
                    width: 2
                },
                {
                    color: redThreshold ? "#FFD3D2" : "transparent",
                    dashStyle: 'long',
                    // zIndex: 3,
                    value: alertThresholds.lowRed,
                    width: 2
                },
                {
                    color: baseLineUpperDeviation && baselineDeviation ? "#8ECFC0" : "transparent",
                    dashStyle: 'long',
                    shadow: true,
                    // className: "plotlineshadow",
                    value: Number(baseLineValue) + Number(baselineDeviationValues),
                    // zIndex: 3,
                    width: 2.5
                }
            ], plotBands: alertBands
        },
        tooltip: {
            formatter() {
                const pointData = graphDataWithDeviation.find(row => row.timestamp === this.point.x)
                return Highcharts.dateFormat('%A, %d %b %Y %H:%M', pointData.timestamp) + '<br><br>' +
                    '<b>Temprature: </b>' + pointData.value + '<br>' + 
                    '<b>Deviation: </b>' + 
                    '<span>&#177;</span>' + pointData.deviation + '<br>'
            }
        },
        series: [{
            name: 'Temperature',
            color: '#1499AD',
            type: 'areaspline',
            data: lineGraphData,
            zIndex: 20,
            lineWidth: 3.2,
            fillColor: 'transparent',
            threshold: Number(baseLineValue) - Number(baselineDeviationValues),
            zones: [
                {
                    value: 40,
                    fillColor: 'transparent'
                }, {
                    value: Number(baseLineValue) + Number(baselineDeviationValues),
                    fillColor: deviationIndicator ? {
                                linearGradient: [0, 0, 0, 230],
                                stops: [
                                    [0, "#1E94E7"],
                                    [1,  Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            } : "transparent",
                }, {
                    value: Number(baseLineValue) - Number(baselineDeviationValues),
                    fillColor: 'transparent'
                }, {
                    value: yAxisMin,
                    fillColor: deviationIndicator ? {
                                linearGradient: [0, 0, 0, 200],
                                linearGradient: [0, 0, 0, 200],
                                stops: [
                                    [0, "#1E94E7"],
                                    [1,  Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            } : "transparent",
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
            shadow: {
                color: "black",
                width: 20,
                opacity: 0.003,
                // offsetY: 10
            },
            opacity: 0.7,
            color: "#E8E6E6",
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




