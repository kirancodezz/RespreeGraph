import { useCallback } from "react";
import { isEmpty } from "lodash";
import moment from "moment";

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
      const minimumDateShown = formattedTimestamp[formattedTimestamp.length - 4]
      return {
        formattedVitals,
        lineChartValues,
        lineChartValuesOnly,
        median,
        deviationGraph,
        formattedTimestamp,
        minimumDateShown
      };
    },
    [medianCalculator]
  );

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
      // if high or low value does not exist
      if (!alertsBands?.highRed && !alertsBands?.highAmber) {
        alerts.push()
      }
      if (!alertsBands?.lowRed && !alertsBands?.lowAmber) {
        alerts.push()
      }

      // If either one of high value value exist
      if (alertsBands?.highRed && !alertsBands?.highAmber) {
        alerts.push({ visibility: alertsBands.redThreshold, color: "#ffd3d2", from: alertsBands.yAxisMax, to: alertsBands?.highRed, });
      }
      if (!alertsBands?.highRed && alertsBands?.highAmber) {
        alerts.push({ visibility: alertsBands.amberThreshold, color: "#ffe8cf", from: alertsBands.highAmber, to: alertsBands.yAxisMax })
      }
      // If either one of Low value value exist
      if (alertsBands?.lowRed && !alertsBands?.lowAmber) {
        alerts.push({ visibility: alertsBands.redThreshold, color: "#ffd3d2", from: alertsBands.yAxisMin, to: alertsBands?.lowRed, });
      }
      if (!alertsBands?.lowRed && alertsBands?.lowAmber) {
        alerts.push({ visibility: alertsBands.amberThreshold, color: "#ffe8cf", from: alertsBands.lowAmber, to: alertsBands.yAxisMin })
      }

      // if both high red and high amber exist
      if (alertsBands?.highRed && alertsBands?.highAmber) {
        if (alertsBands?.highRed > alertsBands?.highAmber) {
          alerts.push(
            { visibility: alertsBands.redThreshold, color: "#ffd3d2", from: alertsBands.yAxisMax, to: alertsBands?.highRed, },
            { visibility: alertsBands.amberThreshold, color: "#ffe8cf", from: alertsBands.highRed, to: alertsBands.highAmber }
          );
        } else {
          alerts.push(
            { visibility: alertsBands.redThreshold, color: "#ffd3d2", from: alertsBands.highRed, to: alertsBands?.highAmber },
            { visibility: alertsBands.amberThreshold, color: "#ffe8cf", from: alertsBands.highAmber, to: alertsBands.yAxisMax, }
          );
        }
      }
      // if both low red and low amber exist
      if (alertsBands?.lowRed && alertsBands?.lowAmber) {
        if (alertsBands?.lowRed > alertsBands?.lowAmber) {
          alerts.push(
            { visibility: alertsBands.redThreshold, color: "#ffd3d2", from: alertsBands.lowRed, to: alertsBands?.lowAmber, },
            { visibility: alertsBands.amberThreshold, color: "#ffe8cf", from: alertsBands.lowAmber, to: alertsBands.yAxisMin, }
          );
        } else {
          alerts.push(
            { visibility: alertsBands.redThreshold, color: "#ffd3d2", from: alertsBands.yAxisMin, to: alertsBands?.lowRed, },
            { visibility: alertsBands.amberThreshold, color: "#ffe8cf", from: alertsBands.lowAmber, to: alertsBands.lowRed, }
          );
        }
      }

      const alertObjectCreator = (items) => {
        const object = items?.map((item) => {
          return {
            zIndex: "-1",
            color: item.visibility ? item.color : "transparent",
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
