import React, { useEffect, useState } from 'react';
import GraphComponent from './components';
import GlobalControls from './components/controls/GlobalControls';
import "./styles/chartStyle.css"


const GraphModule = () => {
    const [chartData, setChartData] = useState();
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
    useEffect(() => {
        fetch("https://u6wawzlr6h.execute-api.ap-southeast-1.amazonaws.com/respiree-api/dev/query/trends?start_datetime=2022-02-08T02:28:49&stop_datetime=2022-03-10T02:28:49&id=160&resolution=daily")
            .then(res => res.json())
            .then(
                (result) => {
                    setChartData(result?.response)
                }
            )
    }, [setChartData])

    const graphData = [
        {
            name: 'Respiratory Rate ',
            data: {
                timestamps: chartData?.metrics?.listdate || [],
                // vitals: [11, 10, 25, 32, 24, 24, 25, 38, 25, 24, 2, 24, 25, 33, 24, 22, 4, 24, 23, 39, 22, 12, 25, 37, 24, 15, 22, 19, 6, 3],
                vitals: chartData?.metrics?.["RR"] || [],
                deviations: chartData?.metrics_SD?.["RR"] || []
            },
            mean: chartData?.metrics_SD?.["metrics_overall_mean"] || 0,
            bandThreshHoldValues: {
                highRedValue: 30,
                highAmberValue: 20,
                lowRedValue: 10,
                lowAmberValue: 15,
            },
            latestValue: 21,
            latestDeviation: 9
        },
        {
            name: 'Heart Rate',
            data: {
                timestamps: chartData?.metrics?.listdate || [],
                vitals: chartData?.metrics?.["HR"] || [],
                deviations: chartData?.metrics_SD?.["HR"] || []
            },
            mean: chartData?.metrics_SD?.["metrics_overall_mean"] || 0,
            bandThreshHoldValues: {
                highRedValue: 100,
                highAmberValue: 90,
                lowAmberValue: 80,
                lowRedValue: 70,
            },
            latestValue: 70,
            latestDeviation: 4
        },
        {
            name: 'SpO2',
            data: {
                timestamps: chartData?.metrics?.listdate || [],
                vitals: chartData?.metrics?.["SpO2"] || [],
                deviations: chartData?.metrics_SD?.["SpO2"] || []
            },
            mean: chartData?.metrics_SD?.["metrics_overall_mean"] || 0,
            bandThreshHoldValues: {
                highRedValue: null,
                highAmberValue: null,
                lowAmberValue: 94,
                lowRedValue: 91,
            },
            latestValue: 98,
            latestDeviation: 6
        },
        {
            name: 'activity',
            data: {
                timestamps: chartData?.metrics?.listdate || [],
                vitals: chartData?.metrics?.["activity"] || [],
                deviations: chartData?.metrics_SD?.["activity"] || []
            },
            mean: chartData?.metrics_SD?.["metrics_overall_mean"] || 0,
            bandThreshHoldValues: {
                highRedValue: null,
                highAmberValue: null,
                lowAmberValue: null,
                lowRedValue: null,
            },
            latestValue: 55,
            latestDeviation: 10
        },
        {
            name: 'EWS',
            data: {
                timestamps: chartData?.metrics?.listdate || [],
                vitals: chartData?.metrics?.["EWS"] || [],
                deviations: chartData?.metrics_SD?.["EWS"] || []
            },
            mean: chartData?.metrics_SD?.["metrics_overall_mean"] || 0,
            bandThreshHoldValues: {
                highRedValue: 7,
                highAmberValue: 5,
                lowAmberValue: null,
                lowRedValue: null,
            },
            latestValue: 8,
            latestDeviation: 3
        },
        {
            name: 'Weight',
            data: {
                timestamps: chartData?.metrics?.listdate || [],
                vitals: chartData?.metrics?.["weight"] || [],
                deviations: chartData?.metrics_SD?.["weight"] || []
            },
            mean: chartData?.metrics_SD?.["metrics_overall_mean"] || 0,
            bandThreshHoldValues: {
                highRedValue: null,
                highAmberValue: null,
                lowAmberValue: null,
                lowRedValue: null,
            },
            latestValue: 62,
            latestDeviation: 10
        },
        {
            name: 'Systolic Blood Pressure',
            data: {
                timestamps: chartData?.metrics?.listdate || [],
                vitals: chartData?.metrics?.["BP_Sys"] || [],
                deviations: chartData?.metrics_SD?.["BP_Sys"] || []
            },
            mean: chartData?.metrics_SD?.["metrics_overall_mean"] || 0,
            bandThreshHoldValues: {
                highRedValue: null,
                highAmberValue: null,
                lowAmberValue: null,
                lowRedValue: null,
            },
            latestValue: 120,
            latestDeviation: 20
        },
        {
            name: 'Diastolic Blood Pressure',
            data: {
                timestamps: chartData?.metrics?.listdate || [],
                vitals: chartData?.metrics?.["BP_Dia"] || [],
                deviations: chartData?.metrics_SD?.["BP_Dia"] || []
            },
            mean: chartData?.metrics_SD?.["metrics_overall_mean"] || 0,
            bandThreshHoldValues: {
                highRedValue: null,
                highAmberValue: null,
                lowAmberValue: null,
                lowRedValue: null,
            },
            latestValue: 85,
            latestDeviation: 12 
        },
        {
            name: 'Respiratory Tidal Depth',
            data: {
                timestamps: chartData?.metrics?.listdate || [],
                vitals: chartData?.metrics?.["RR_TD"] || [],
                deviations: chartData?.metrics_SD?.["RR_TD"] || []
            },
            mean: chartData?.metrics_SD?.["metrics_overall_mean"] || 0,
            bandThreshHoldValues: {
                highRedValue: null,
                highAmberValue: null,
                lowAmberValue: null,
                lowRedValue: null,
            },
            latestValue: 0.89,
            latestDeviation: 1
        },
        {
            name: 'Respiratory Duty Cycle',
            data: {
                timestamps: chartData?.metrics?.listdate || [],
                vitals: chartData?.metrics?.["RR_DC"] || [],
                deviations: chartData?.metrics_SD?.["RR_DC"] || []
            },
            mean: chartData?.metrics_SD?.["metrics_overall_mean"] || 0,
            bandThreshHoldValues: {
                highRedValue: null,
                highAmberValue: null,
                lowAmberValue: null,
                lowRedValue: null,
            },
            latestValue: 70,
            latestDeviation: 8
        },
        {
            name: 'temperature',
            data: {
                timestamps: chartData?.metrics?.listdate,
                vitals: chartData?.metrics?.["temperature"] || [],
                deviations: chartData?.metrics_SD?.["temperature"] || [],
            },
            mean: chartData?.metrics_SD?.["metrics_overall_mean"] || 0,
            bandThreshHoldValues: {
                highRedValue: 38,
                highAmberValue: 37.5,
                lowAmberValue: null,
                lowRedValue: null,
            },
            latestValue: 36,
            latestDeviation: 9
        },

    ];
    return (
        <div className="graphsContainer">
            <GlobalControls
                baseline={baseline}
                baselineDeviation={baselineDeviation}
                amberThreshold={amberThreshold}
                redThreshold={redThreshold}
                thresholdIndicator={thresholdIndicator}
                standardDeviation={standardDeviation}
                deviationIndicator={deviationIndicator}
                setGraphComponentCheckbox={setGraphComponentCheckbox}
                graphComponentsCheckbox={graphComponentsCheckbox}
            />
            {graphData?.map((element, index) => (
                <div className='graphContainer' key={index}>
                    <GraphComponent
                        graphs={element}
                        index={index}
                        baseline={baseline}
                        baselineDeviation={baselineDeviation}
                        amberThreshold={amberThreshold}
                        redThreshold={redThreshold}
                        thresholdIndicator={thresholdIndicator}
                        standardDeviation={standardDeviation}
                        deviationIndicator={deviationIndicator}
                    />
                </div>
            ))}
        </div>
    )
}

export default GraphModule;