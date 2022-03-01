import { useCallback } from "react";
import { isEmpty } from "lodash";
import moment from "moment";

// const alertBandColorGradients={
//   red:["#ffd3d2", "#ffd3d2"],
//   amber:["#FFE8CF", "#FFE8CF"]
// }
// const alertBands={
//   RED:'RED',
//   AMBER:'AMBER'
// }

const useGraphDataFormatter = () => {
  const medianCalculator = useCallback((values) => {
    if (values.length === 0) {
      return 0;
    }

    values.sort(function (a, b) {
      return a - b;
    });

    let half = Math.floor(values.length / 2);

    if (values.length % 2) return values[half];

    return (values[half - 1] + values[half]) / 2.0;
  }, []);

  const formatGraphData = useCallback(
    ({ timestamps = [], vitals = [], deviations = [] }) => {
      if (isEmpty(timestamps)) {
        return [];
      }
      const formattedVitals = [];
      const lineChartValues = [];
      const lineChartValuesOnly = [];
      const formattedTimestamp = [];
      const deviationGraph = [];
      timestamps.forEach((value, index) => {
        let date = new Date(value);
        formattedTimestamp.push(date.getTime());
      });
      formattedTimestamp.forEach((value, index) => {
        const currentVitalValue = vitals[index];
        if (currentVitalValue >= 0) {
          const timeInMilliSeconds = moment(value).format("x");
          const vitalDeviation = deviations[index];
          formattedVitals.push({
            timestamp: Number(timeInMilliSeconds),
            value: currentVitalValue,
            deviation: vitalDeviation,
          });
          lineChartValues.push([Number(timeInMilliSeconds), currentVitalValue]);
          lineChartValuesOnly.push(currentVitalValue);
          deviationGraph.push([
            Number(timeInMilliSeconds),
            Number(currentVitalValue) + Number(deviations[index]),
            Number(currentVitalValue) - Number(deviations[index]),
          ]);
        }
      });
      const median = medianCalculator(lineChartValuesOnly);
      return {
        formattedVitals,
        lineChartValues,
        lineChartValuesOnly,
        median,
        deviationGraph,
        formattedTimestamp,
      };
    },
    [medianCalculator]
  );
  /**
   * @param alertBand red|amber
   * @param range -[from,to]
   * @param visibility boolean
   * @param className- string
   * 
   * 
   */
  // const createAlertBands=(alertBand="",range=[0,0],visibility=false,className="")=>{
//   const createAlertBands=({redBand={
//     alertBand="",range=[0,0],visibility=false,className=""
//   },amberband={
//     alertBand="",range=[0,0],visibility=false,className=""
//   }})=>{

    
//     if(isEmpty(range)||isEmpty(alertBand)){
//       return {};
//     }
//     const [from,to]=range;
//     return {
//       className,
//       visibility,
//       stops:alertBand===alertBands.RED ? alertBandColorGradients.red :alertBand=== alertBands.AMBER ? alertBandColorGradients.amber :[],
//       from,
//       to,
//     }
//   }

//   createAlertBands({redBand:{},amber:{}})

  const calculateGraphAlertBands = useCallback(
    (
      alertsBands = {
        highRed: "",
        highAmber: "",
        lowRed: "",
        lowAmber: "",
        yAxisMax: "",
        yAxisMin: "",
        amberThreshold: "",
        redThreshold: "",
      }
    ) => {
      let alerts = [];

      if (alertsBands?.highRed && alertsBands?.highAmber) {
        if (alertsBands?.highRed > alertsBands?.highAmber) {
          
          alerts.push(
            { className: "redBorder", visibility: alertsBands.redThreshold, stops: ["#FFE3E2", "#FFE3E2"], from: alertsBands.yAxisMax, to: alertsBands?.highRed, },
            { className: "", visibility: alertsBands.amberThreshold, stops: ["#FFEDD9", "#FFEDD9"], from: alertsBands.highRed, to: alertsBands.highAmber }
          );
        } else {
          alerts.push(
            {className: "redBorder", visibility: alertsBands.redThreshold, stops: ["#FFE3E2", "#FFE3E2"], from: alertsBands.yAxisMax, to: alertsBands?.highAmber },
            { className: "", visibility: alertsBands.amberThreshold, stops: ["#FFEDD9", "#FFEDD9"], from: alertsBands.highAmber, to: alertsBands.highRed, }
          );
        }
      }
      if (alertsBands?.lowRed && alertsBands?.lowAmber) {
        if (alertsBands?.lowRed > alertsBands?.lowAmber) {
          alerts.push(
            {className: "redBorder", visibility: alertsBands.redThreshold, stops: ["#FFE3E2", "#FFE3E2"], from: alertsBands.yAxisMin, to: alertsBands?.lowRed, },
            {className: "", visibility: alertsBands.amberThreshold, stops: ["#FFEDD9", "#FFEDD9"], from: alertsBands.lowRed, to: alertsBands.lowAlerts,}
          );
        } else {
          alerts.push(
            {className: "redBorder", visibility: alertsBands.redThreshold, stops: ["#FFE3E2", "#FFE3E2"], from: alertsBands.yAxisMin, to: alertsBands?.lowRed,}, 
            {className: "",visibility: alertsBands.amberThreshold, stops: ["#FFEDD9", "#FFEDD9"], from: alertsBands.lowAmber, to: alertsBands.lowRed,}
          );
        }
      }
      const alertObjectCreator = (items) => {
        const object = items?.map((item) => {
          return {
            className: item.className,
            zIndex: "-1",
            color: item.visibility ? {
              linearGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
              stops: item.stops.map((element, index) => {
                return [index, element];
              }),
            } : "transparent",
            from: item.from,
            to: item.to,
          };
        });
        return object;
      };

      return alertObjectCreator(alerts);
    },
    []
  );

  return { formatGraphData, calculateGraphAlertBands };
};

export default useGraphDataFormatter;
