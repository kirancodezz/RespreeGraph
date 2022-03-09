import React, { useState, useEffect } from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import useGraphDataFormatter from "../../Hooks/useGraphDataFormatter";


const GraphPlotter = ({
    data,
    name,
    deviationFromBaseline,
    isCalculatedValueShown,
    baseLineLowerDeviation,
    baseLineUpperDeviation,
    baseLineValue,
    setBaselineValue,
    baseline,
    deviationIndicator,
    thresholdIndicator,
    baselineDeviation,
    amberThreshold,
    redThreshold,
    standardDeviation
}) => {
    HC_more(Highcharts);
    const [yAxisMax, setYAxisMax] = useState(0);
    const [yAxisMin, setYAxisMin] = useState(0);
    const [dateRange, setDateRange] = useState();
    const [min, setMin] = useState(null);
    const [max, setMax] = useState(null);
    const [baselineDeviationValues, setBaselineDeviationValues] = useState(0);
    const { formatGraphData, calculateGraphAlertBands } = useGraphDataFormatter()
    const chartData = formatGraphData(data.data)
    const alertThresholds = {
        highRed: 35,
        highAmber: 30,
        lowAmber: 10,
        lowRed: 3,
        yAxisMax: yAxisMax,
        yAxisMin: 0,
        amberThreshold: amberThreshold,
        redThreshold: redThreshold
    }
    const alertBands = calculateGraphAlertBands((alertThresholds))
    const { lowAmber, lowRed, highAmber, highRed } = alertThresholds
    const graphDataWithDeviation = chartData.formattedVitals;
    const lineGraphData = chartData.lineChartValues;
    const medianValue = chartData.median;
    const deviationGraph = chartData.deviationGraph;
    const formattedTimestamp = chartData.formattedTimestamp;
    useEffect(() => {
        if (highRed > highAmber) {
            if (highRed > yAxisMax) {
                setMax(yAxisMax + 5)
            } else {
                setMax(highAmber + (highRed - highAmber) / 2)
            }
        } else {
            if (highAmber > yAxisMax) {
                setMax(yAxisMax + 5)
            }
            setMax(highAmber + (highAmber - highRed) / 2)
        }

        if (lowAmber > lowRed) {
            setMin(lowAmber / 2)
        } else {
            setMin(lowRed / 2)
        }
    }, [lowAmber, lowRed, min, max, highAmber, highRed, yAxisMax])
    useEffect(() => {
        setBaselineDeviationValues((baseLineValue / 100) * deviationFromBaseline)
    }, [deviationFromBaseline, baseLineValue])

    useEffect(() => {
        setDateRange(formattedTimestamp?.[formattedTimestamp?.length - 10])
    }, [formattedTimestamp, dateRange])

    useEffect(() => {
        if (isCalculatedValueShown === true) {
            setBaselineValue(medianValue)
        }
    }, [isCalculatedValueShown, medianValue, setBaselineValue])

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
            height: "280",
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
                                    radius: 8.6
                                }
                            })

                        })
                    }, 900)
                },
                render: function () {
                    let chart = this;
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
        xAxis: {
            // range: 1,
            min: dateRange,
            type: 'datetime',
            gridLineWidth: 1,
            gridLineColor: "#eeeeee",
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
            gridLineWidth: 1,
            gridLineColor: '#eeeeee',
            minorGridLineWidth: 0,
            tickLength: 9,
            tickWidth: 1.5,
            labels: {
                style: {
                    color: '#242637',
                    fontSize: "12px",
                }
            },
            min: min,
            max: max,
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
                    color: baseLineLowerDeviation && baselineDeviation ? "#70cbb5" : "transparent",
                    dashStyle: 'long',
                    // zIndex: 3,
                    value: baseLineValue - baselineDeviationValues,
                    width: 2.5
                },
                {
                    color: baseLineUpperDeviation && baselineDeviation ? "#70cbb5" : "transparent",
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
                    `<b class="vitalName">${name}: </b>` + pointData.value + '<br>' +
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
            lineWidth: 4,
            fillColor: 'transparent',
            threshold: Number(baseLineValue) + Number(baselineDeviationValues),
            zones: [
                {
                    value: 40,
                    fillColor: 'transparent'
                }, {
                    value: Number(baseLineValue) + Number(baselineDeviationValues),
                    fillColor: deviationIndicator ? {
                        linearGradient: [0, 0, 0, 190],
                        stops: [
                            [0, "#1E94E7"],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    } : "transparent",
                },
                {
                    value: Number(baseLineValue) - Number(baselineDeviationValues),
                    fillColor: 'transparent'
                },
                {
                    value: yAxisMin,
                    fillColor: deviationIndicator ? {
                        linearGradient: [0, 190, 0, 0],
                        stops: [
                            [0, "#1E94E7"],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
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

        ],
    }
    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} onLoad={() => { }}></HighchartsReact>
        </div>
    )
}

export default GraphPlotter;