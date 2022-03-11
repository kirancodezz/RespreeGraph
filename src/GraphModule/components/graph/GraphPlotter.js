import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HC_more from "highcharts/highcharts-more";
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
  standardDeviation,
}) => {
  
  HC_more(Highcharts); // HighChart more extension initialization

  const [yAxisMax, setYAxisMax] = useState(0);
  const [yAxisMin, setYAxisMin] = useState(0);
  const [dateRange, setDateRange] = useState();
  const [baselineDeviationValues, setBaselineDeviationValues] = useState(0);
  const { formatGraphData, calculateGraphAlertBands } = useGraphDataFormatter(); // Formatter hook 
  
  
  const alertThresholds = {
    highRed: data?.bandThreshHoldValues?.highRedValue,
    highAmber: data?.bandThreshHoldValues?.highAmberValue,
    lowAmber: data?.bandThreshHoldValues?.lowAmberValue,
    lowRed: data?.bandThreshHoldValues?.lowRedValue,
    yAxisMax: yAxisMax,
    yAxisMin: 0,
    amberThreshold: amberThreshold,
    redThreshold: redThreshold,
  };
  const alertBands = calculateGraphAlertBands(alertThresholds); // passes alert threshold to useGraphDataFormatter hook 
  const { lowAmber, lowRed, highAmber, highRed } = alertThresholds;
  
  const chartData = formatGraphData(data.data);
  const graphDataWithDeviation = chartData.formattedVitals;
  const lineGraphData = chartData.lineChartValues;
  const medianValue = chartData.median;
  const deviationGraph = chartData.deviationGraph;
  const formattedTimestamp = chartData.formattedTimestamp;
  
  // finds biggest and lowest values in a graph data
  const topValueOfGraph = chartData?.lineChartValuesOnly ? Math.max(...chartData?.lineChartValuesOnly || "") : "";
  const minValueOfGraph = chartData?.lineChartValuesOnly ? Math.min(...chartData?.lineChartValuesOnly || "") : "";

  // finds higher threshold maximum and minimum value.
  const highThresholdMaximumValue = highAmber && highRed ? Math.max(...[highAmber, highRed]) : null;
  const lowThresholdMaximumValue = Math.min(...[highAmber, highRed]);

  // finds lower threshold maximum and minimum value.
  const bottomThresholdMaximumValue = lowAmber && lowRed ? Math.max(...[lowAmber, lowRed]) : null;
  const bottomThresholdMinimumValue = Math.min(...[lowAmber, lowRed]);

  // Deviation from baseline percentage and value calculation 
  useEffect(() => {
    setBaselineDeviationValues((baseLineValue / 100) * deviationFromBaseline);
  }, [deviationFromBaseline, baseLineValue]);

  // To set the range of xAxis, To show from which date it should start
  useEffect(() => {
    setDateRange(formattedTimestamp?.[formattedTimestamp?.length - 12]);
  }, [formattedTimestamp, dateRange]);

  // To set baseline
  useEffect(() => {
    if (isCalculatedValueShown === true) {
      setBaselineValue(medianValue);
    }
  }, [isCalculatedValueShown, medianValue, setBaselineValue]);

  // Conditions for alert values
  const noAlerts = !highRed && !highAmber && !lowRed && !lowAmber 
  const allAlerts = highRed && highAmber && lowRed && lowAmber // All alert points present
  const allAlertsCondition = (highRed > highAmber) && (lowAmber > lowRed) // To check biggest value

  // Only one value conditions
  const onlyHighRed = highRed && !highAmber && !lowRed && !lowAmber 
  const onlyHighAmber = !highRed && highAmber && !lowRed && !lowAmber
  const onlyLowRed = !highRed && !highAmber && lowRed && !lowAmber
  const onlyLowAmber = !highRed && !highAmber && !lowRed && lowAmber

  // Only high or low value conditions
  const onlyHighValues = highRed && highAmber && !lowRed && !lowAmber
  const onlyHighValuesCondition = highRed > highAmber // finds biggest value
  const onlyLowValues = !highRed && !highAmber && lowRed && lowAmber
  const onlyLowValuesCondition = lowRed > lowAmber // finds biggest value

  // Only only value in higher threshold and one value in lower threshold
  const onlyHighAmberAndLowAmber = !highRed && highAmber && !lowRed && lowAmber
  const onlyHighRedLowRed = highRed && !highAmber && lowRed && !lowAmber
  const onlyHighRedLowAmber = highRed && !highAmber && !lowRed && lowAmber
  const onlyHighAmberLowRed = !highRed && highAmber && lowRed && !lowAmber

  // full higher threshold and one lower OR full lower and one higher value
  const onlyHighValuesAndLowRed = highRed && highAmber && lowRed && !lowAmber
  const onlyHighValuesAndLowAmber = highRed && highAmber && !lowRed && lowAmber
  const onlyLowValuesAndHighRed = highRed && !highAmber && lowRed && lowAmber
  const onlyLowValuesAndHighAmber = !highRed && highAmber && lowRed && lowAmber

  const options = {
    chart: {
      title: "",
      type: "spline",
      panning: true,
      zoomType: false,
      pinchType: false,
      scrollablePlotArea: {
        scrollPositionX: 1,
      },
      animation: true,
      height: "240",
      events: {
        redraw: function () {
          const chart = this;
          setYAxisMax(chart.axes[1].max);
          setYAxisMin(chart.axes[1].min);
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
                    chart.plotSizeY + chart.plotTop,
                  ])
                  .attr({
                    class: "customLine",
                    "stroke-width": 2.2,
                    zIndex: 4,
                    stroke: // marker color condition // 
                    noAlerts ? "transparent" :
                      onlyHighRed ? point.y >= highRed ? "#F3857C" : "transparent" :
                        onlyHighAmber ? point.y >= highAmber ? "#FFB359" : "transparent" :
                          onlyLowRed ? point.y <= lowRed ? "#F3857C" : "transparent" :
                            onlyLowAmber ? point.y <= lowAmber ? "#FFB359" : "transparent" :

                              onlyHighValues ? onlyHighValuesCondition ? point.y >= highRed ? "#F3857C" : point.y >= highAmber ? "#FFB359" : "transparent" : point.y >= highAmber ? "#FFB359" : point.y >= highRed ? "#F3857C" : "transparent" :
                                onlyLowValues ? onlyLowValuesCondition ? point.y <= lowAmber ? "#FFB359" : point.y <= lowRed ? "#F3857C" : "transparent" : point.y <= lowRed ? "#F3857C" : point.y <= lowAmber ? "#FFB359" : "transparent" :
                                  onlyHighAmberAndLowAmber ? point.y >= highAmber ? "#FFB359" : point.y <= lowAmber ? "#FFB359" : "transparent" :
                                    onlyHighRedLowRed ? point.y >= highRed ? "#F3857C" : point.y <= lowRed ? "#F3857C" : "transparent" :
                                      onlyHighRedLowAmber ? point.y >= highRed ? "#F3857C" : point.y <= lowAmber ? "#FFB359" : "transparent" :
                                        onlyHighAmberLowRed ? point.y >= highAmber ? "#FFB359" : point.y <= lowRed ? "#F3857C" : "transparent" :

                                          onlyHighValuesAndLowRed ? onlyHighValuesCondition ? point.y >= highRed ? "#F3857C" : point.y >= highAmber ? "#FFB359" : point.y <= lowRed ? "#F3857C" : "transparent" : point.y >= highAmber ? "#FFB359" : point.y >= highRed ? "#F3857C" : point.y <= lowRed ? "#F3857C" : "transparent" :
                                            onlyHighValuesAndLowAmber ? onlyHighValuesCondition ? point.y >= highRed ? "#F3857C" : point.y >= highAmber ? "#FFB359" : point.y <= lowRed ? "#F3857C" : point.y <= lowAmber ? "#FFB359" : "transparent" : point.y >= highAmber ? "#FFB359" : point.y >= highRed ? "#F3857C" : point.y <= lowRed ? "#F3857C" : point.y <= lowAmber ? "#FFB359" : "transparent" :
                                              onlyLowValuesAndHighAmber ? point.y >= highAmber ? "#FFB359" : onlyLowValuesCondition ? point.y <= lowAmber ? "#FFB359" : point.y <= lowRed ? "#F3857C" : "transparent" : point.y >= highAmber ? "#FFB359" : point.y <= lowRed ? "#F3857C" : point.y <= lowAmber ? "#FFB359" : "transparent" :
                                                onlyLowValuesAndHighRed ? point.y >= highRed ? "#F3857C" : onlyLowValuesCondition ? point.y <= lowAmber ? "#FFB359" : point.y <= lowRed ? "#F3857C" : "transparent" : point.y >= highRed ? "#F3857C" : point.y <= lowRed ? "#F3857C" : point.y <= lowAmber ? "#FFB359" : "transparent" :
                                                  allAlerts ? allAlertsCondition ? point.y >= highRed ? "#F3857C" : point.y >= highAmber ? "#FFB359" : point.y <= lowRed ? "#F3857C" : point.y <= lowAmber ? "#FFB359" : "transparent" :
                                                    point.y >= highAmber ? "#FFB359" : point.y >= highRed ? "#F3857C" : point.y <= lowAmber ? "#FFB359" : point.y <= lowRed ? "#F3857C" : "transparent"
                                                    : "transparent",
                    display: false,
                  })
                  .add();
                chart.myCustomLines.push(chart.myCustomLine);
              });
            });
            const data = chart.series[0].data;
            data.forEach((element) => {
              element.update({ // marker color condition
                color: noAlerts ? "#1499AD" :
                  onlyHighRed ? element.y >= highRed ? "#F3857C" : "#1499AD" :
                    onlyHighAmber ? element.y >= highAmber ? "#FFB359" : "#1499AD" :
                      onlyLowRed ? element.y <= lowRed ? "#F3857C" : "#1499AD" :
                        onlyLowAmber ? element.y <= lowAmber ? "#FFB359" : "#1499AD" :

                          onlyHighValues ? onlyHighValuesCondition ? element.y >= highRed ? "#F3857C" : element.y >= highAmber ? "#FFB359" : "#1499AD" : element.y >= highAmber ? "#FFB359" : element.y >= highRed ? "#F3857C" : "#1499AD" :
                            onlyLowValues ? onlyLowValuesCondition ? element.y <= lowAmber ? "#FFB359" : element.y <= lowRed ? "#F3857C" : "#1499AD" : element.y <= lowRed ? "#F3857C" : element.y <= lowAmber ? "#FFB359" : "#1499AD" :
                              onlyHighAmberAndLowAmber ? element.y >= highAmber ? "#FFB359" : element.y <= lowAmber ? "#FFB359" : "#1499AD" :
                                onlyHighRedLowRed ? element.y >= highRed ? "#F3857C" : element.y <= lowRed ? "#F3857C" : "#1499AD" :
                                  onlyHighRedLowAmber ? element.y >= highRed ? "#F3857C" : element.y <= lowAmber ? "#FFB359" : "#1499AD" :
                                    onlyHighAmberLowRed ? element.y >= highAmber ? "#FFB359" : element.y <= lowRed ? "#F3857C" : "#1499AD" :

                                      onlyHighValuesAndLowRed ? onlyHighValuesCondition ? element.y >= highRed ? "#F3857C" : element.y >= highAmber ? "#FFB359" : element.y <= lowRed ? "#F3857C" : "#1499AD" : element.y >= highAmber ? "#FFB359" : element.y >= highRed ? "#F3857C" : element.y <= lowRed ? "#F3857C" : "#1499AD" :
                                        onlyHighValuesAndLowAmber ? onlyHighValuesCondition ? element.y >= highRed ? "#F3857C" : element.y >= highAmber ? "#FFB359" : element.y <= lowRed ? "#F3857C" : element.y <= lowAmber ? "#FFB359" : "#1499AD" : element.y >= highAmber ? "#FFB359" : element.y >= highRed ? "#F3857C" : element.y <= lowRed ? "#F3857C" : element.y <= lowAmber ? "#FFB359" : "#1499AD" :
                                          onlyLowValuesAndHighAmber ? element.y >= highAmber ? "#FFB359" : onlyLowValuesCondition ? element.y <= lowAmber ? "#FFB359" : element.y <= lowRed ? "#F3857C" : "#1499AD" : element.y >= highAmber ? "#FFB359" : element.y <= lowRed ? "#F3857C" : element.y <= lowAmber ? "#FFB359" : "#1499AD" :
                                            onlyLowValuesAndHighRed ? element.y >= highRed ? "#F3857C" : onlyLowValuesCondition ? element.y <= lowAmber ? "#FFB359" : element.y <= lowRed ? "#F3857C" : "#1499AD" : element.y >= highRed ? "#F3857C" : element.y <= lowRed ? "#F3857C" : element.y <= lowAmber ? "#FFB359" : "#1499AD" :
                                              allAlerts ? allAlertsCondition ? element.y >= highRed ? "#F3857C" : element.y >= highAmber ? "#FFB359" : element.y <= lowRed ? "#F3857C" : element.y <= lowAmber ? "#FFB359" : "#1499AD" :
                                                element.y >= highAmber ? "#FFB359" : element.y >= highRed ? "#F3857C" : element.y <= lowAmber ? "#FFB359" : element.y <= lowRed ? "#F3857C" : "#1499AD"
                                                : "#1499AD",
                className: "markerShadow",
                marker: {
                  radius: 8.6,
                },
              });
            });
          }, 900);
        },

        render: function () {
          let chart = this;
          setTimeout(() => {
            const series = [chart?.series?.[0]];
            series.forEach(function (series, j) {
              series?.data?.forEach(function (point, i) {
                chart?.myCustomLines?.[i]
                  ?.attr({
                    d: [
                      "M",
                      chart.plotLeft + point.plotX,
                      chart.plotTop + point.plotY,
                      "L",
                      chart.plotLeft + point.plotX,
                      chart.plotSizeY + chart.plotTop,
                    ],
                  })
                  ?.attr({
                    "stroke-width": thresholdIndicator ? 3 : 0, // shows and hide the vertical lines on condition
                  });
              });
            });
          }, 50);
        },

      },
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        stickyTracking: false,
      },
      animation: true,
      line: {
        dataLables: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
    },

    xAxis: {
      min: dateRange,
      type: "datetime",
      gridLineWidth: 1,
      gridLineColor: "#eeeeee",
      minorGridLineWidth: 0,
      tickLength: 9,
      tickWidth: 1.5,
      zIndex: 10,
      lineColor: "transparent",
      accessibility: {
        rangeDescription: "Range: Jul 1st 2009 to Jul 31st 2009.",
      },
      labels: {
        align: "center",
        useHTML: true,
        formatter: function () { // Custom tooltip 
          const month = Highcharts.dateFormat("%b", this.value);
          const day = Highcharts.dateFormat("%e", this.value);
          return `<div class="daydateWrapper"><p class="dayDate" >${month}<br></p><p class="dayStyle">${day}</p></div>`;
        },
      },
      tickColor: "#164f57ba",
    },
    yAxis: {
      gridLineWidth: 1,
      gridLineColor: "#eeeeee",
      minorGridLineWidth: 0,
      tickInterval: null,
      tickLength: 9,
      tickWidth: 1.5,
      startOnTick: false,
      endOnTick: false,
      labels: {
        style: {
          color: "#242637",
          fontSize: "12px",
        },
      },
      min: bottomThresholdMaximumValue ? bottomThresholdMinimumValue < minValueOfGraph ? bottomThresholdMinimumValue - ((bottomThresholdMaximumValue - bottomThresholdMinimumValue) / 2) : minValueOfGraph - ((10 / 100) * bottomThresholdMinimumValue) : null,
      max: highThresholdMaximumValue ?
        topValueOfGraph > highThresholdMaximumValue ? topValueOfGraph + (15 / 100) * topValueOfGraph : topValueOfGraph < highThresholdMaximumValue ? highThresholdMaximumValue + ((highThresholdMaximumValue - lowThresholdMaximumValue) / 2) : ""
        : null,
      tickColor: "#164f57ba",
      title: {
        text: null,
      },
      scrollbar: {
        enabled: true,
        showFull: false,
      },
      plotLines: [
        {
          color: baseline ? "#7CBFC9" : "transparent",
          dashStyle: "Dash",
          visible: false,
          // zIndex: 3,
          value: baseLineValue,
          width: 2.5,
        },
        {
          color:
            baseLineLowerDeviation && baselineDeviation
              ? "#93D1DA"
              : "transparent",
          dashStyle: "long",
          // zIndex: 3,
          value: baseLineValue - baselineDeviationValues,
          width: 2,
        },
        {
          color:
            baseLineUpperDeviation && baselineDeviation
              ? "#93D1DA"
              : "transparent",
          dashStyle: "long",
          shadow: true,
          // className: "plotlineshadow",
          value: Number(baseLineValue) + Number(baselineDeviationValues),
          // zIndex: 3,
          width: 2,
        },
      ],
      plotBands: alertBands,
    },
    tooltip: {
      formatter() {
        const pointData = graphDataWithDeviation.find(
          (row) => row.timestamp === this.point.x
        );
        return (
          `${Highcharts.dateFormat("%A, %d %b %Y %H:%M", pointData.timestamp)}<br><br>
            <b class="vitalName">${name}: ${pointData.value || "- -"}</b><br>
            ${pointData.deviation ? `<b class="Deviation">Deviation: <span>&#177;</span> ${pointData.deviation || "- -"}</b><br>` : ""}
          `
        );
      },
    },


    series: [
      {
        name: "Temperature",
        color: "#1499AD",
        type: "areaspline",
        data: lineGraphData,
        zIndex: 20,
        lineWidth: 4,
        fillColor: "transparent",
        threshold: Number(baseLineValue) + Number(baselineDeviationValues),
        zones: [
          {
            fillColor: "transparent",
          },
          {
            value: Number(baseLineValue) + Number(baselineDeviationValues),
            fillColor: deviationIndicator
              ? {
                linearGradient: [0, 0, 0, 190],
                stops: [
                  [0, "#1E94E7"],
                  [
                    1,
                    Highcharts.color(Highcharts.getOptions().colors[0])
                      .setOpacity(0)
                      .get("rgba"),
                  ],
                ],
              }
              : "transparent",
          },
          {
            value: yAxisMax,
            fillColor: "transparent"
          },
          {
            value: Number(baseLineValue) - Number(baselineDeviationValues),
            fillColor: "transparent",
          },
          {
            value: yAxisMin,
            fillColor: deviationIndicator
              ? {
                linearGradient: [0, 190, 0, 0],
                stops: [
                  [0, "#1E94E7"],
                  [
                    1,
                    Highcharts.color(Highcharts.getOptions().colors[0])
                      .setOpacity(0)
                      .get("rgba"),
                  ],
                ],
              }
              : "transparent",
          },
        ],
      },
      {
        name: "Range",
        data: deviationGraph,
        zIndex: 0,
        visible: standardDeviation,
        type: "areasplinerange",
        lineWidth: 0,
        linkedTo: ":previous",
        shadow: {
          color: "black",
          width: 20,
          opacity: 0.0039,
          // offsetY: 10
        },
        opacity: 0.9,
        color: "#E8E6E6",
        tooltip: {
          enabled: false,
        },
        marker: {
          enabled: false,
        },
      },
    ],
  };
  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        onLoad={() => { }}
      ></HighchartsReact>
    </div>
  );
};

export default GraphPlotter;
