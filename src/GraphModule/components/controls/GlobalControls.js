import React from 'react';
import "../../styles/GlobalControls.css"
const GlobalControls = () => {
    return(
        <>
        <div className="praphComponentsChecks">
                <ul>
                    <li>
                        <div className="checkbox">
                            <input type="checkbox" id="baseline" name="" value=""  />
                            <label htmlFor="baseline"><span>Baseline</span></label>
                        </div>
                    </li>
                    <li>
                        <div className="checkbox">
                            <input type="checkbox" id="deviationIndicator" name="" value="" />
                            <label htmlFor="deviationIndicator"><span>Deviation Indicator</span></label>
                        </div>
                    </li>
                    <li>
                        <div className="checkbox">
                            <input type="checkbox" id="thresholdIndicator" name="" value="" />
                            <label htmlFor="thresholdIndicator"><span>Threshold Indicator</span></label>
                        </div>
                    </li>
                    <li>
                        <div className="checkbox">
                            <input type="checkbox" id="baselineDeviation" name="" value="" />
                            <label htmlFor="baselineDeviation"><span>Baseline Deviation</span></label>
                        </div>
                    </li>
                    <li>
                        <div className="checkbox">
                            <input type="checkbox" id="amberThreshold" name="" value="" />
                            <label htmlFor="amberThreshold"><span>Amber Threshold</span></label>
                        </div>
                    </li>
                    <li>
                        <div className="checkbox">
                            <input type="checkbox" id="redThreshold" name="" value="" />
                            <label htmlFor="redThreshold"><span>Red Threshold</span></label>
                        </div>
                    </li>

                    <li>
                        <div className="checkbox">
                            <input type="checkbox" id="standardDeviation" name="" value=""  />
                            <label htmlFor="standardDeviation"><span>Standard Deviation</span></label>
                        </div>
                    </li>
                </ul>
            </div>
        </>
        
    )
}


export default GlobalControls