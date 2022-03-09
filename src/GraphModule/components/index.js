import React, { useState } from "react";
import GraphPlotter from "./graph/GraphPlotter";
import ChartControls from "./controls/ChartControls";

const GraphComponent = ({
    graphs, 
    index,
    baseline,
    deviationIndicator,
    thresholdIndicator,
    baselineDeviation,
    amberThreshold,
    redThreshold,
    standardDeviation
}) => {
    const [baseLineValue, setBaselineValue] = useState(0);
    const [deviationFromBaseline, setDeviationFromBaseline] = useState(10)
    const [isCalculatedValueShown, setIsCalculatedValueShown] = useState(true)
    const [baseLineLowerDeviation, setBaseLineLowerDeviation] = useState(true)
    const [baseLineUpperDeviation, setBaseLineUpperDeviation] = useState(true)
    return(
        <>
            <ChartControls
                index={index}
                name={ graphs.name || "--" }
                baseLineValue={ baseLineValue }
                setBaselineValue={ setBaselineValue }
                setDeviationFromBaseline={setDeviationFromBaseline}
                deviationFromBaseline={deviationFromBaseline}
                isCalculatedValueShown={isCalculatedValueShown}
                setIsCalculatedValueShown={setIsCalculatedValueShown}
                baseLineLowerDeviation={baseLineLowerDeviation}
                setBaseLineLowerDeviation={setBaseLineLowerDeviation}
                baseLineUpperDeviation={baseLineUpperDeviation}
                setBaseLineUpperDeviation={setBaseLineUpperDeviation}
            />
            <GraphPlotter 
                data={graphs}
                name={ graphs.name || "--" }
                baseLineValue={baseLineValue}
                setBaselineValue={setBaselineValue}
                deviationFromBaseline={deviationFromBaseline}
                isCalculatedValueShown={isCalculatedValueShown}
                baseLineLowerDeviation={baseLineLowerDeviation}
                baseLineUpperDeviation={baseLineUpperDeviation}
                baseline={baseline}
                deviationIndicator={deviationIndicator}
                thresholdIndicator={thresholdIndicator}
                baselineDeviation={baselineDeviation}
                amberThreshold={amberThreshold}
                redThreshold={redThreshold}
                standardDeviation={standardDeviation}
            />
        </>
    )
}

export default GraphComponent;