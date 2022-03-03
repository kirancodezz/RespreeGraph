import React from "react";

const Graph = ({ 
    HighchartsReact, 
    options, 
    Highcharts, 
    baseline,
    baselineDeviation,
    amberThreshold, 
    redThreshold, 
    thresholdIndicator, 
    standardDeviation,
    deviationIndicator,
    onGraphCheckboxClicked,
    baseLineValue,
    isCalculatedValueShown,
    setIsCalculatedValueShown,
    setBaselineValue,
    baseLineUpperDeviation,
    setBaseLineUpperDeviation,
    baseLineLowerDeveiation,
    setBaseLineLowerDeveiation,
    deviationFromBaseline,
    setDeviationFromBaseline
}

) => {
    return(
        <div className="graphWrapper">
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
            <div className="graphControlsContainer">
                <div className="controlsElements">
                    <h3>Temperature</h3>
                    <div className="elementsValues">
                        <p className="label">Latest</p><p className="labelValue">150.80</p>
                        <p className="minusPlusValue"><span>&#177;</span>10</p>
                    </div>
                </div>

                <div className="rightControls">
                    <div className="controlsElements baslineControl">
                        <p className="headerLabel">Baseline <br/> value</p>
                        <div className="baselineValueContainer">
                        <input 
                            type="number" 
                            className="baseLineValue" 
                            onChange={(e) => {setBaselineValue(e.target.value)}} 
                            disabled={isCalculatedValueShown === true ? true : false} 
                            value={baseLineValue || 0} 
                        />
                        </div>
                        <div className="typeSelector">
                        <label className="selectType bottomMargin" onClick={() => {setIsCalculatedValueShown(false)}} ><p>Manual</p>
                            <input type="radio" name="radio" defaultChecked={isCalculatedValueShown === false ? true : false}/>
                            <span className="checkmark"></span>
                        </label> 
                        <label className="selectType" onClick={() => {setIsCalculatedValueShown(true)}}  ><p>Calculated</p>
                            <input type="radio" name="radio"  defaultChecked={isCalculatedValueShown === true ? true : false } />
                            <span className="checkmark"></span>
                        </label>
                        </div>
                    </div>
                    <div className="controlsElements">
                    <p className="deviationHeader">Deviation<br></br><span>(From Baseline)</span></p>
                    <div className="DeviationChanger">
                        <div className="deviationControls">
                            <button className="leftButton" onClick={() => {setDeviationFromBaseline(deviationFromBaseline-1)}}> <img alt="controls" src={require('../assets/right.png')} /><span>&#177;</span></button>
                            <input type="text" value={`${deviationFromBaseline}%`} onChange={() => {}}/>
                            <button onClick={() => {setDeviationFromBaseline(deviationFromBaseline+1)}} > <img alt="controls" src={require('../assets/play.png')} /> </button>
                        </div>
                    </div>
                    <div className="container"> 
                    <div className="checkbox">
                        <input type="checkbox" id="higher" name="" value="" onClick={() => {setBaseLineUpperDeviation(!baseLineUpperDeviation)}}  defaultChecked={baseLineUpperDeviation ? true : false} />
                        <label htmlFor="higher"><span>Higher</span></label>
                    </div>
                    <div className="checkbox">
                        <input type="checkbox" id="lower" name="" value=""  onClick={() => {setBaseLineLowerDeveiation(!baseLineLowerDeveiation)}}  defaultChecked={baseLineLowerDeveiation ? true : false} />
                        <label htmlFor="lower"><span>Lower</span></label>
                    </div>
                    </div>
                </div>
                </div>
            </div>
                <HighchartsReact highcharts={Highcharts} options={options}  onLoad = {() => {
                    console.log("ddddd")
                }}>
            </HighchartsReact>



            <div className="Demo"></div>
        </div>
    )
}

export default Graph;