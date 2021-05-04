import React from "react";
import {
    XYPlot,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    XAxis,
    YAxis,
} from "react-vis";
import "../../node_modules/react-vis/dist/style.css";
import "../css/Main.css";

const ConcentGraphComp = () => {
    return (
        <div className="Main-ContentGraphComp">
            <p>ConcentGraphComp</p>
            <XYPlot height={150} width={300} stackBy="y">
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalBarSeries
                    data={[
                        { x: 2, y: 10 },
                        { x: 4, y: 5 },
                        { x: 5, y: 15 },
                    ]}
                />
                <VerticalBarSeries
                    data={[
                        { x: 2, y: 12 },
                        { x: 4, y: 2 },
                        { x: 5, y: 11 },
                    ]}
                />
            </XYPlot>
        </div>
    );
};

export default ConcentGraphComp;
