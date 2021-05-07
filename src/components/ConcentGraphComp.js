import React from "react";
import {
    XYPlot,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    LineSeries,
    XAxis,
    YAxis,
} from "react-vis";
import "../css/MainGraph.css";
import "../css/Main.css";

const ConcentGraphComp = () => {
    return (
        <div className="Main-ContentGraphComp">
            <h4>집중 그래프</h4>
            <XYPlot
                height={150}
                width={600}
                stackBy="y"
                xType="ordinal"
                className="graph"
            >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalBarSeries
                    color="#C4C4C4"
                    barWidth={0.3}
                    data={[
                        { x: "Mon", y: 2 },
                        { x: "Tue", y: 5 },
                        { x: "Wed", y: 6 },
                        { x: "Thu", y: 3 },
                        { x: "Fri", y: 3 },
                        { x: "Sat", y: 5 },
                        { x: "Sun", y: 3 },
                    ]}
                />
                <VerticalBarSeries
                    color="#ffc9c9"
                    opacity={50}
                    barWidth={0.3}
                    data={[
                        { x: "Mon", y: 1 },
                        { x: "Tue", y: 3 },
                        { x: "Wed", y: 4 },
                        { x: "Thu", y: 4 },
                        { x: "Fri", y: 5 },
                        { x: "Sat", y: 2 },
                        { x: "Sun", y: 1 },
                    ]}
                />
            </XYPlot>
        </div>
    );
};

export default ConcentGraphComp;
