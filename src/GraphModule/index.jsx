import React from 'react';
import ChartControls from './components/controls/ChartControls';
import GlobalControls from './components/controls/GlobalControls';
import "./styles/chartStyle.css"

const GraphModule = () => {
    return(
        <div>
            <GlobalControls/>
            <ChartControls/>
            graphElement
        </div>
    )
}

export default GraphModule;