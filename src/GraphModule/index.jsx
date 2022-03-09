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
        fetch("https://u6wawzlr6h.execute-api.ap-southeast-1.amazonaws.com/respiree-api/dev/query/trends?start_datetime=2022-01-22T05:32:33&stop_datetime=2022-02-21T05:32:33&id=4&resolution=daily")
            .then(res => res.json())
            .then(
                (result) => {
                    setChartData(result?.response)
                }
            )
    }, [setChartData])

    const graphData = [
        {
            name: 'Temperature',
            data: {
                timestamps: chartData?.metrics?.listdate,
                // vitals: chartData?.metrics?.["HR"],
                vitals: [ 11, 10, 25, 32, 24, 24, 25, 38, 25, 24, 2, 24, 25, 33, 24, 22, 4, 24, 23, 39, 22, 12, 25, 37, 24, 15, 22, 19, 6, 20 ],
                deviations: chartData?.metrics_SD?.["HR"]
            },
            alertThresholds : {
                highRed: 36,
                highAmber: 30,
                lowAmber: 10,
                lowRed: 4,
            }
        },
        // {
        //     name: 'Respiratory Rate',
        //     data: {
        //         timestamps: chartData?.metrics?.listdate,
        //         vitals: chartData?.metrics?.["HR"],
        //         deviations: chartData?.metrics_SD?.["HR"]
        //     },
        //     alertThresholds : {
        //         highRed: 36,
        //         highAmber: 30,
        //         lowAmber: 10,
        //         lowRed: 4,
        //     }
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