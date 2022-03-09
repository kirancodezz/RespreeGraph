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
        fetch("https://u6wawzlr6h.execute-api.ap-southeast-1.amazonaws.com/respiree-api/dev/query/trends?start_datetime=2022-02-07T12:14:36&stop_datetime=2022-03-09T12:14:36&id=4&resolution=daily")
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
                timestamps: chartData?.metrics?.listdate,
                vitals: chartData?.metrics?.["RR"] || [],
                deviations: chartData?.metrics_SD?.["RR"] || []
            },
            bandThreshHoldValues : {
                highRedValue: 30,
                highAmberValue: 25,
                lowAmberValue: 10,
                lowRedValue: 8,
            },
            latestValue: 100.33
        },
        {
            name: 'Respiratory Tidal Depth',
            data: {
                timestamps: chartData?.metrics?.listdate,
                vitals: chartData?.metrics?.["RR_TD"] || [],
                deviations: chartData?.metrics_SD?.["RR_TD"] || []
            },
            bandThreshHoldValues : {
                highRedValue: null,
                highAmberValue: null,
                lowAmberValue: null,
                lowRedValue: null,
            },
            latestValue: 100.33
        },
        {
            name: 'Heart Rate',
            data: {
                timestamps: chartData?.metrics?.listdate,
                vitals: chartData?.metrics?.["HR"] || [],
                deviations: chartData?.metrics_SD?.["HR"] || []
            },
            bandThreshHoldValues : {
                highRedValue: 100,
                highAmberValue: 90,
                lowAmberValue: 80,
                lowRedValue: 70,
            },
            latestValue: 100.33
        },
        // {
        //     name: 'SpO2',
        //     data: {
        //         timestamps: chartData?.metrics?.listdate,
        //         vitals: chartData?.metrics?.["SpO2"] || [],
        //         deviations: chartData?.metrics_SD?.["SpO2"] || []
        //     },
        //     bandThreshHoldValues : {
        //         highRedValue: 90,
        //         highAmberValue: null,
        //         lowAmberValue: 94,
        //         lowRedValue: 91,
        //     },
        //     latestValue: 100.33
        // }
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