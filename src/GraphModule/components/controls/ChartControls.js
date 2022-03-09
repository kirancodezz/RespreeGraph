import React,{ useState } from "react"
import "../../styles/chartControl.css"

const ChartControls = ({
    index,
    name,
    setDeviationFromBaseline,
    deviationFromBaseline,
    isCalculatedValueShown,
    setIsCalculatedValueShown,
    baseLineLowerDeviation,
    setBaseLineLowerDeviation,
    baseLineUpperDeviation,
    setBaseLineUpperDeviation,
    setBaselineValue,
    baseLineValue
}) => {
    const [ isMenuCollapsed, setIsMenuCollapsed ] = useState(true)
    return (
        <>
            <div className="graphControllerWrapper" style={{display: isMenuCollapsed ? "inline-flex" : "flex"}} key={index}>
                <div className="controls">
                    <p className="graphName">{name}</p>
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
                {!isMenuCollapsed ? 
                <>
                <div className="baselineReading">
                    <div className="controlsElements baslineControl">
                        <p className="headerLabel">Baseline value</p>
                        <div className="baselineValueContainer">
                            <input
                                type="number"
                                className="baseLineValue"
                                onChange={(e) => { setBaselineValue(e.target.value) }}
                                disabled={isCalculatedValueShown === true ? true : false}
                                value={baseLineValue || 0}
                            />
                        </div>
                        <div className="typeSelector">
                            <label className="selectType bottomMargin" onClick={() => { setIsCalculatedValueShown(false) }} key={index} ><p>Manual</p>
                                <input type="radio" name={index} defaultChecked={isCalculatedValueShown === false ? true : false} key={index} />
                                <span className="checkmark" key={index} ></span>
                            </label>
                            <label className="selectType" onClick={() => { setIsCalculatedValueShown(true) }}  key={index} ><p>Calculated</p>
                                <input type="radio" name={index} defaultChecked={isCalculatedValueShown === true ? true : false} key={index} />
                                <span className="checkmark" key={index} ></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="deviationReading">
                    <div className="controlsElements deviationControlElements">
                        <p className="deviationHeader">Deviation<br></br><span>(From Baseline)</span></p>
                        <div className="DeviationChanger">
                            <div className="deviationControls">
                                <button className="leftButton" onClick={() => { setDeviationFromBaseline(deviationFromBaseline - 1) }}> <img alt="controls" src={require('../../../assets/right.png')} /><span>&#177;</span></button>
                                <input type="text" value={`${deviationFromBaseline}%`} onChange={() => { }} />
                                <button onClick={() => { setDeviationFromBaseline(deviationFromBaseline + 1) }} > <img alt="controls" src={require('../../../assets/play.png')} /> </button>
                            </div>
                        </div>
                        <div className="container"> 
                    <div className="checkbox checkboxFirst">
                        <input type="checkbox" id={`higher${index}`} name="" value="" onClick={() => {setBaseLineUpperDeviation(!baseLineUpperDeviation)}}  defaultChecked={baseLineUpperDeviation ? true : false} />
                        <label htmlFor={`higher${index}`} ><span>Higher</span></label>
                    </div>
                    <div className="checkbox">
                        <input type="checkbox" id={`lower${index}`} name="" value=""  onClick={() => {setBaseLineLowerDeviation(!baseLineLowerDeviation)}}  defaultChecked={baseLineLowerDeviation ? true : false} />
                        <label htmlFor={`lower${index}`}><span>Lower</span></label>
                    </div>
                    </div>
                    </div>
                </div>
                </>   : "" 
            }   
                <button className="colapseButton" style={{margin: isMenuCollapsed ? "3px" : "3px 0px 3px 11px"}} onClick={() => {setIsMenuCollapsed(!isMenuCollapsed)}} >{isMenuCollapsed ? ">>" : "<<"}</button>
            </div>
        </>
    )
}

export default ChartControls;
