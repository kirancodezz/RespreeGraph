import { useCallback } from "react"
import { isEmpty } from "lodash"
import moment from "moment"

const useGraphDataFormatter = () => {
    const medianCalculator = useCallback((values) => {
        if (values.length === 0) {
            return 0
        };

        values.sort(function (a, b) {
            return a - b;
        });

        let half = Math.floor(values.length / 2);

        if (values.length % 2)
            return values[half];

        return (values[half - 1] + values[half]) / 2.0;
    }, [])


    const formatGraphData = useCallback(({
        timestamps = [],
        vitals = [],
        deviations = [],
    }) => {
        if (isEmpty(timestamps)) {
            return []
        }
        const formattedVitals = []
        const lineChartValues = []
        const lineChartValuesOnly = []
        const formattedTimestamp = []
        const deviationGraph = []
        timestamps.forEach((value, index) => {
            let date = new Date(value);
            formattedTimestamp.push( date.getTime())
        })
        formattedTimestamp.forEach((value, index) => {
            const currentVitalValue = vitals[index];
            if (currentVitalValue >= 0) {
                const timeInMilliSeconds = moment(value).format("x")
                const vitalDeviation = deviations[index]
                formattedVitals.push(
                    {
                        timestamp: Number(timeInMilliSeconds), value: currentVitalValue, deviation: vitalDeviation
                    }
                )
                lineChartValues.push([Number(timeInMilliSeconds), currentVitalValue])
                lineChartValuesOnly.push(currentVitalValue)
                deviationGraph.push([Number(timeInMilliSeconds), Number(currentVitalValue) + Number(deviations[index]), Number(currentVitalValue) - Number(deviations[index])] )
            }
        })
        const median = medianCalculator(lineChartValuesOnly)
        return { formattedVitals, lineChartValues, lineChartValuesOnly, median, deviationGraph, formattedTimestamp };
    }, [ medianCalculator ])

    const calculateGraphAlertBands = useCallback((
        alertsBands = {
            highRed: "",
            highAmber: "",
            lowRed: "",
            lowAmber: "",
            yAxisMax: "",
            yAxisMin: ""
        }
    ) => {
        let highAlerts  = []
        if(alertsBands?.highRed && alertsBands?.highAmber ) {
            if(alertsBands?.highRed > alertsBands?.highAmber ) {
                highAlerts =  [
                        {
                            className: "redBorder",
                            color: "#ffd3d2",
                            from: alertsBands.yAxisMax,
                            to: alertsBands?.highRed
                        },
                        {
                            className: "",
                            color: "#ffe8cf",
                            from: alertsBands.highRed,
                            to: alertsBands.highAmber
                        }
                    ]
            } else {
                highAlerts = [
                    {
                        className: "redBorder",
                        color: "#ffd3d2",
                        from: alertsBands.yAxisMax,
                        to: alertsBands?.highAmber
                    },
                    {
                        className: "",
                        color: "#ffe8cf",
                        from: alertsBands.highAmber,
                        to: alertsBands.highRed
                    }
                ]
            }
        }
        
        let lowAlerts  = []
        if(alertsBands?.lowRed && alertsBands?.lowAmber ) {
            if(alertsBands?.lowRed > alertsBands?.lowAmber ) {
                lowAlerts =  [
                        {
                            className: "redBorder",
                            color: "#ffd3d2",
                            from: alertsBands.yAxisMin,
                            to: alertsBands?.lowRed
                        },
                        {
                            className: "",
                            color: "#FFE8CF",
                            from: alertsBands.lowRed,
                            to: alertsBands.lowAlerts
                        }
                    ]
            } else {
                lowAlerts = [
                    {
                        className: "redBorder",
                        color: "#ffd3d2",
                        from: alertsBands.yAxisMin,
                        to: alertsBands?.lowAmber
                    },
                    {
                        className: "",
                        color: "#FFE8CF",
                        from: alertsBands.lowAmber,
                        to: alertsBands.lowRed
                    }
                ]
            }
        }

        return [...highAlerts, ...lowAlerts]

    }, [])
    return { formatGraphData, calculateGraphAlertBands }
}

export default useGraphDataFormatter;