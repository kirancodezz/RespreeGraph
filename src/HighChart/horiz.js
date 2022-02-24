(function(H) {
    H.wrap(H.PlotLineOrBand.prototype, 'render', function(proceed) {
  
      H.fireEvent(this, 'render');
      const pick = H.pick,
        defined = H.defined;
  
      var plotLine = this,
        axis = plotLine.axis,
        horiz = axis.horiz,
        log = axis.logarithmic,
        options = plotLine.options,
        optionsLabel = options.label,
        label = plotLine.label,
        to = options.to,
        from = options.from,
        value = options.value,
        isBand = H.defined(from) && defined(to),
        isLine = defined(value),
        svgElem = plotLine.svgElem,
        isNew = !svgElem,
        path = [],
        color = options.color,
        zIndex = pick(options.zIndex, 0),
        events = options.events,
        attribs = {
          'class': 'highcharts-plot-' + (isBand ? 'band ' : 'line ') +
            (options.className || '')
        },
        groupAttribs = {},
        renderer = axis.chart.renderer,
        groupName = isBand ? 'bands' : 'lines',
        group;
      // logarithmic conversion
      if (log) {
        from = log.log2lin(from);
        to = log.log2lin(to);
        value = log.log2lin(value);
      }
      // Set the presentational attributes
      if (!axis.chart.styledMode) {
        if (isLine) {
          attribs.stroke = color || '#999999';
          attribs['stroke-width'] = pick(options.width, 1);
          if (options.dashStyle) {
            attribs.dashstyle =
              options.dashStyle;
          }
        } else if (isBand) { // plot band
          attribs.fill = color || '#e6ebf5';
          if (options.borderWidth) {
            attribs.stroke = options.borderColor;
            attribs['stroke-width'] = options.borderWidth;
          }
        }
      }
      // Grouping and zIndex
      groupAttribs.zIndex = zIndex;
      groupName += '-' + zIndex;
      group = axis.plotLinesAndBandsGroups[groupName];
      if (!group) {
        axis.plotLinesAndBandsGroups[groupName] = group =
          renderer.g('plot-' + groupName)
          .attr(groupAttribs).add();
      }
      // Create the path
      if (isNew) {
        /**
         * SVG element of the plot line or band.
         *
         * @name Highcharts.PlotLineOrBand#svgElement
         * @type {Highcharts.SVGElement}
         */
        plotLine.svgElem = svgElem = renderer
          .path()
          .attr(attribs)
          .add(group);
      }
      // Set the path or return
      if (isLine) {
  
  
        path = axis.getPlotLinePath({
          value: value,
          lineWidth: svgElem.strokeWidth(),
          acrossPanes: options.acrossPanes
        });
        if (!axis.chart.inverted && options.from) {
          const plotLineStartingPoint = axis.chart.yAxis[0].toPixels(options.from);
          path[0][2] = plotLineStartingPoint;
        } else if (axis.chart.inverted && options.from) {
          const plotLineStartingPoint = axis.chart.yAxis[0].toPixels(options.from);
          path[0][1] = plotLineStartingPoint;
        }
      } else if (isBand) { // plot band
        path = axis.getPlotBandPath(from, options);
      } else {
        return;
      }
      // common for lines and bands
      if ((isNew || !svgElem.d) && path && path.length) {
        svgElem.attr({
          d: path
        });
        // events
        if (events) {
          objectEach(events, function(event, eventType) {
            svgElem.on(eventType, function(e) {
              events[eventType].apply(plotLine, [e]);
            });
          });
        }
      } else if (svgElem) {
        if (path) {
          svgElem.show(true);
          svgElem.animate({
            d: path
          });
        } else if (svgElem.d) {
          svgElem.hide();
          if (label) {
            plotLine.label = label = label.destroy();
          }
        }
      }
      // the plot band/line label
      if (optionsLabel &&
        (defined(optionsLabel.text) || defined(optionsLabel.formatter)) &&
        path &&
        path.length &&
        axis.width > 0 &&
        axis.height > 0 &&
        !path.isFlat) {
        // apply defaults
        optionsLabel = merge({
          align: horiz && isBand && 'center',
          x: horiz ? !isBand && 4 : 10,
          verticalAlign: !horiz && isBand && 'middle',
          y: horiz ? isBand ? 16 : 10 : isBand ? 6 : -4,
          rotation: horiz && !isBand && 90
        }, optionsLabel);
        this.renderLabel(optionsLabel, path, isBand, zIndex);
      } else if (label) { // move out of sight
        label.hide();
      }
      // chainable
      return plotLine;
    })
  })(Highcharts)
  
  
  Highcharts.chart('container', {
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      plotLines: [{
        color: '#FF0000',
        width: 2,
        value: 3,
        from: 129.2
      }]
    },
  
    series: [{
      data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
  });
  





//   horz
import React, { useState, useEffect } from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import "./HighChart.css";
import "./hchart.css";
import Graph from "./Graph.component";


const HighChrt = () => {
    const dashLines = [[1497830400000, 23]]
    function drawDashLine (chart, point, dashLine) {
        const xAxis = chart.xAxis[0]
        const yAxis = chart.yAxis[0]
        
        const x = Math.round(xAxis.toPixels(point[0]))
        const y = Math.round(yAxis.toPixels(point[1]))
        const d = [
                    'M', 
                     xAxis.left, y, 
                    'L', x, y, 
                    'L', x, 
                    yAxis.top + yAxis.height
                ] 
      
        return dashLine
          ? dashLine.attr({ d })
          : chart.renderer.path(d).attr({ 'stroke-dasharray': '0', 'stroke': 'skyblue', 'stroke-width': 4, zIndex: 1 }).add()
      }
      
    
    const [uplineThreshold, setUplineThreshold] = useState("20");
    const [isCalulatedDeviationShown, setIscalulateddeviationShown] = useState(true);
    const [isLowerPlotlineShow, setIsLowerPlotlineShow] = useState(true);
    const [isHigherPlotlineShow, setSsHigherPlotlineShow] = useState(true);
    const [deviationFromBaselineValue, setDeviationFromBaselineValue] = useState(23);
    const [baseLineValue, setBaselineValue] = useState(0);
    const [lowestYaxisValue, setLowestYaxisValue] = useState(0);
    const [yAxisMax, setYAxisMax] = useState(0);
    const [yAxisMin, setYAxisMin] = useState(0);
    const [isCalculatedValueShown, setIsCalculatedValueShown] = useState(true)
    const [baseLineUpperDeviation, setBaseLineUpperDeviation] = useState(true)
    const [baseLineLowerDeveiation, setBaseLineLowerDeveiation] = useState(true)
    const [graphComponentsCheckbox, setGraphComponentCheckbox] = useState({
        baseline : true,
        baselineDeviation: true,
        amberThreshold: true,
        redThreshold: true,
        thresholdIndicator: true,
        standardDeviation: true,
    })


  



    const { baseline, baselineDeviation, amberThreshold, redThreshold, thresholdIndicator, standardDeviation } = graphComponentsCheckbox
    const onGraphCheckboxClicked = (checkbox, boolean) => {
        setGraphComponentCheckbox({...graphComponentsCheckbox, [checkbox]: boolean })
    }
    const median = (values) => {
        if(values.length ===0) {
            return 0
        };

        values.sort(function(a,b){
            return a-b;
        });

        var half = Math.floor(values.length / 2);
        
        if (values.length % 2)
            return values[half];
        
        return (values[half - 1] + values[half]) / 2.0;
    }

    HC_more(Highcharts);
    const [ranges, setRanges] = useState(
        [
            // [1497398400000, 10, 17],
            // [1497484800000, 12, 18],
            // [1497571200000, 13, 20],
            // [1497830400000, 18, 26],
            // [1497916800000, 20, 28],
            // [1498003200000, 20, 29.1],
            // [1498089600000, 22, 31],
            // [1498176000000, 23, 32],
            // [1498435200000, 24, 32],
            // [1498521600000, 24, 32],
            // [1498608000000, 24, 33],
            // [1498780800000, 25, 33],
            // [1499040000000, 22, 31],
            // [1499126400000, 21, 30],
            // [1499212800000, 20, 29],
            // [1499299200000, 20, 28],
            // [1499385600000, 19, 27],
            // [1499644800000, 12, 24],
            // [1499731200000, 10, 22],
            // [1499817600000, 9, 20],
            // [1499904000000, 8, 19],
            // [1500249600000, 7, 17],
            // [1500336000000, 7, 17.5],
            // [1500422400000, 8, 18.5],
            // [1500595200000, 9, 27],
            // [1500940800000, 20, 32],
            // [1501027200000, 21, 32],
            // [1501113600000, 22, 32],
            // [1501200000000, 23, 32],
            // [1501459200000, 24, 32],
            // [1501545600000, 23, 31],
            // [1501632000000, 22, 30],
            // [1501718400000, 21, 29],
            // [1501804800000, 20, 29],
            // [1502064000000, 14, 25],
            // [1502150400000, 13, 23],
            // [1502236800000, 12, 21],
            // [1502323200000, 11, 20],
            // [1502409600000, 10.8, 19],
            // [1502668800000, 10.8, 18],
            // [1502755200000, 10.8, 19],
            // [1502841600000, 10.8, 19],
            // [1502928000000, 10.8, 20],
        ]
    )
    
    const chartData = [
        [1497398400000, 14],
        [1497484800000, 15],
        [1497571200000, 18],
        [1497830400000, 23],
        [1497916800000, 24],
        [1498003200000, 25],
        [1498089600000, 26],
        [1498176000000, 27],
        [1498435200000, 29],
        [1498521600000, 29.5],
        [1498608000000, 29.5],
        [1498780800000, 29.6],
        [1499040000000, 28],
        [1499126400000, 27],
        [1499212800000, 26],
        [1499299200000, 25],
        [1499385600000, 24],
        [1499644800000, 19],
        [1499731200000, 17],
        [1499817600000, 16],
        [1499904000000, 14],
        [1500249600000, 11],
        [1500336000000, 12],
        [1500422400000, 12],
        [1500595200000, 20],
        [1500940800000, 27],
        [1501027200000, 28],
        [1501113600000, 29],
        [1501200000000, 29],
        [1501459200000, 29],
        [1501545600000, 28],
        [1501632000000, 27],
        [1501718400000, 26],
        [1501804800000, 25],
        [1502064000000, 20],
        [1502150400000, 18],
        [1502236800000, 16],
        [1502323200000, 14],
        [1502409600000, 13],
        [1502668800000, 14],
        [1502755200000, 15],
        [1502841600000, 16],
        [1502928000000, 18],
];


const chartValues = chartData.map((value, index) => {
    return value[1]
})

useEffect(() => {
    // console.log( Math.max( ...chartValues )
    setLowestYaxisValue(Math.min(...chartValues))        
    // console.log("lowestYaxisValue", lowestYaxisValue < 0)
    if(isCalculatedValueShown === true){
        setBaselineValue(median(chartValues))
    }
})
    const options = {
        chart: {
            title: "",
            type: 'spline',
            zoomType: 'x',
            events: {
                redraw: function() {
                    const chart = this;
                    setYAxisMax(chart.axes[1].max)
                    setYAxisMin(chart.axes[1].min)
                },
                load: function() {
                    const chart = this;
                    this.dashLines = dashLines.map(point => drawDashLine(this, point))
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
                                    // radius: 4+(100 * element.y) / 200
                                    radius: 8
                                }
                                })
                        } else if(element.y <= 24){
                            element.update({
                                color: '#23BCD2',
                                plotLines: {
                                    color: '#FF0000',
                                    width: 2,
                                    value: 5.5
                                },
                                className: 'highlightzzzzz',
                                marker: {
                                    radius: 8
                                }
                                })
                        } else {
                            element.update({
                                color: '#FFB359',
                                marker: {
                                    // radius: (100 * element.y) / 200
                                    radius: 8
                                }
                                })
                        }
                    })
                },
                redraw: function () {
                    this.dashLines.forEach((line, i) => drawDashLine(this, dashLines[i], line))
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
            line: {
                dataLables: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        xAxis: {
            type: 'datetime',
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            tickLength: 10,
            tickWidth: 2,
            accessibility: {
                rangeDescription: 'Range: Jul 1st 2009 to Jul 31st 2009.'
            },
            plotLines: [{
                color: '#FF0000',
                width: 2,
                value: 3,
                from: 20
              }]
        },
        yAxis: {
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            tickLength: 10,
            tickWidth: 2,
            min: lowestYaxisValue > 0 ? 0 : null,
            title: {
                text: null
            },
            plotLines: [
                {
                    color: baseline ? "#0A9954" : "transparent",
                    dashStyle: 'longdash', 
                    visible: false,
                    value: baseLineValue, 
                    zIndex:22,
                    width: 3 
                },
                {
                    color: baseLineLowerDeveiation && baselineDeviation ? "#8EA8CF" : "transparent", 
                    dashStyle: 'long', 
                    value: baseLineValue-3, 
                    zIndex:22,
                    width: 3
                },
                {
                    color: baseLineUpperDeviation && baselineDeviation ? "#8EA8CF" : "transparent", 
                    dashStyle: 'long', 
                    value: Number(baseLineValue)+Number(3), 
                    zIndex:22,
                    width: 3 
                }
            ],plotBands: [
                {
                    color: redThreshold ? '#FFD3D266' : "transparent" ,
                    from: yAxisMax,
                    to: "31"
                },
                {
                    color: amberThreshold ? '#FFE8CF' : "transparent" ,
                    from: "31",
                    to: "28"
                },
                {
                    color: redThreshold ? '#FFD3D266' : "transparent" ,
                    from: yAxisMin,
                    to: "8"
                },
                {
                    color: amberThreshold ? '#FFE8CF' : "transparent" ,
                    from: "8",
                    to: "12"
                }
                ]
        },

        //18 -> danger, 20-30 -> normal, 30 -> amber//
        series: [{
            name: 'Temperature',
            color: '#23BCD2',
            type: 'areaspline',
            data: chartData,
            lineWidth: 4,
            fillColor: 'transparent',
            threshold: Number(baseLineValue)+Number(3),
            zIndex: 1,
            zones: [
                {
                    value: Number(baseLineValue)+Number(3),
                    fillColor: 'transparent',
                },
                {
                    value: 32,
                    fillColor: thresholdIndicator ? "#BDDBFF" : "transparent",
                }
            ],
            marker: {
                // fillColor: 'white',
                // lineWidth: 2,
                // lineColor: Highcharts.getOptions().colors[0]
            }
        },{
            name: 'Range',
            data: ranges,
            visible: standardDeviation,
            type: 'areasplinerange',
            lineWidth: 0,
            linkedTo: ':previous',
            color: "#dfdfdf9c",
            fillOpacity: 0.3,
            zIndex: 0,
            marker: {
                enabled: false
            }
        }
    ],  
    }
    
    return(
        <Graph
            HighchartsReact = { HighchartsReact }
            Highcharts = { Highcharts }
            options = { options }
            baseline = {baseline}
            baselineDeviation = {baselineDeviation}
            amberThreshold = {amberThreshold}
            redThreshold = {redThreshold}
            thresholdIndicator = {thresholdIndicator}
            standardDeviation = {standardDeviation}
            onGraphCheckboxClicked = {onGraphCheckboxClicked}
            baseLineValue={baseLineValue}
            setBaselineValue={setBaselineValue}
            setIsCalculatedValueShown={setIsCalculatedValueShown}
            isCalculatedValueShown={isCalculatedValueShown}
            baseLineUpperDeviation = {baseLineUpperDeviation}
            setBaseLineUpperDeviation = {setBaseLineUpperDeviation}
            baseLineLowerDeveiation = {baseLineLowerDeveiation}
            setBaseLineLowerDeveiation={setBaseLineLowerDeveiation}
        />
    )
}

export default HighChrt;



