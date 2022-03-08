import React from "react"
import "../../styles/chartControl.css"

const ChartControls = () => {
    return(
        <>
            <div className="graphControllerWrapper">
                        <div className="controls">
                            <p className="graphName">Temperature</p>
                        </div>
                        <div className="latestReading">
                            <div className="elementsValues">
                                <p className="label">Latest</p>
                                <div className="vitalValue">
                                    <p className="labelValue">150.80</p>
                                    <p className="minusPlusValue"><span>&#177;</span>10</p>
                                </div>
                            </div>
                        </div>
                        <div className="baselineReading">
                            <div className="controlsElements baslineControl">
                                <p className="headerLabel">Baseline value</p>
                                <div className="baselineValueContainer">
                                    <input
                                        type="number"
                                        className="baseLineValue"
                                        // onChange={(e) => { setBaselineValue(e.target.value) }}
                                        // disabled={isCalculatedValueShown === true ? true : false}
                                        // value={baseLineValue || 0}
                                    />
                                </div>
                                <div className="typeSelector">
                                    <label className="selectType bottomMargin" onClick={() => {}} ><p>Manual</p>
                                        <input type="radio" name="radio" defaultChecked={() => {}} />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className="selectType" onClick={() => { }}  ><p>Calculated</p>
                                        <input type="radio" name="radio" defaultChecked={() => {}} />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="deviationReading">
                            <div className="controlsElements deviationControlElements">
                                <p className="deviationHeader">Deviation<br></br><span>(From Baseline)</span></p>
                                <div className="DeviationChanger">
                                    <div className="deviationControls">
                                        <button className="leftButton" onClick={() => {}}> <img alt="controls" src={require('../../../assets/right.png')} /><span>&#177;</span></button>
                                        <input type="text" value={`10%`} onChange={() => { }} />
                                        <button onClick={() => {} } > <img alt="controls" src={require('../../../assets/play.png')} /> </button>
                                    </div>
                                </div>
                                <div className="container">
                                    <div className="checkbox checkboxFirst">
                                        <input type="checkbox" id="higher" name="" value="" onClick={() => { }} defaultChecked={""} />
                                        <label htmlFor="higher"><span>Higher</span></label>
                                    </div>
                                    <div className="checkbox">
                                        <input type="checkbox" id="lower" name="" value="" onClick={() => { }} defaultChecked={""} />
                                        <label htmlFor="lower"><span>Lower</span></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        </>
    )
}

export default ChartControls;