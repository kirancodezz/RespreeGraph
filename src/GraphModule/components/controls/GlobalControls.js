import React from 'react';

const GlobalControls = ({
    setGraphComponentCheckbox, 
    graphComponentsCheckbox,
    baseline,
    deviationIndicator,
    thresholdIndicator,
    baselineDeviation,
    amberThreshold,
    redThreshold,
    standardDeviation
}) => {    
    const onGraphCheckboxClicked = (checkbox, boolean) => {
        setGraphComponentCheckbox({ ...graphComponentsCheckbox, [checkbox]: boolean })
    }
    return(
        <>
      <div className="praphComponentsChecks">
            <ul>
                <li>
                    <div className="checkbox">
                        <input type="checkbox" id="baseline" name=""  value="" defaultChecked={baseline} onClick={() => {onGraphCheckboxClicked("baseline", !baseline)}}/>
                        <label htmlFor="baseline"><span>Baseline</span></label>
                    </div>
                </li>
                <li>
                    <div className="checkbox">
                        <input type="checkbox" id="deviationIndicator" name="" value="" defaultChecked={deviationIndicator} onClick={() => {onGraphCheckboxClicked("deviationIndicator", !deviationIndicator)}} />
                        <label htmlFor="deviationIndicator"><span>Deviation Indicator</span></label>
                    </div>
                </li>
                <li>
                    <div className="checkbox">
                        <input type="checkbox" id="thresholdIndicator" name="" value="" defaultChecked={thresholdIndicator} onClick={() => {onGraphCheckboxClicked("thresholdIndicator", !thresholdIndicator)}} />
                        <label htmlFor="thresholdIndicator"><span>Threshold Indicator</span></label>
                    </div>
                </li>
                <li>
                    <div className="checkbox">
                        <input type="checkbox" id="baselineDeviation" name="" value="" defaultChecked={baselineDeviation} onClick={() => {onGraphCheckboxClicked("baselineDeviation", !baselineDeviation)}} />
                        <label htmlFor="baselineDeviation"><span>Baseline Deviation</span></label>
                    </div>
                </li>
                <li>
                    <div className="checkbox">
                        <input type="checkbox" id="amberThreshold" name="" value="" defaultChecked={amberThreshold} onClick={() => {onGraphCheckboxClicked("amberThreshold", !amberThreshold)}} />
                        <label htmlFor="amberThreshold"><span>Amber Threshold</span></label>
                    </div>
                </li>
                <li>
                    <div className="checkbox">
                        <input type="checkbox" id="redThreshold" name="" value="" defaultChecked={redThreshold} onClick={() => {onGraphCheckboxClicked("redThreshold", !redThreshold)}} />
                        <label htmlFor="redThreshold"><span>Red Threshold</span></label>
                    </div>
                </li>
           
                <li>
                    <div className="checkbox">
                        <input type="checkbox" id="standardDeviation" name="" value="" defaultChecked={standardDeviation} onClick={() => {onGraphCheckboxClicked("standardDeviation", !standardDeviation)}} />
                        <label htmlFor="standardDeviation"><span>Standard Deviation</span></label>
                    </div>
                </li>
            </ul>
        </div>
        </>
        
    )
}


export default GlobalControls