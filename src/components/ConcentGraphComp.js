import React, { useEffect, useState, useContext } from "react";
import {
    XYPlot,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    XAxis,
    YAxis,
} from "react-vis";
import "../css/MainGraph.css";
import "../css/Main.css";
import getApi from "../api/getApi";
import { AuthContext } from "../App";

const initialData = {
    concent: [
        { x: "Mon", y: 2 },
        { x: "Tue", y: 5 },
        { x: "Wed", y: 6 },
        { x: "Thu", y: 3 },
        { x: "Fri", y: 3 },
        { x: "Sat", y: 5 },
        { x: "Sun", y: 3 },
    ],
    play: [
        { x: "Mon", y: 1 },
        { x: "Tue", y: 3 },
        { x: "Wed", y: 4 },
        { x: "Thu", y: 4 },
        { x: "Fri", y: 5 },
        { x: "Sat", y: 2 },
        { x: "Sun", y: 1 },
    ],
};

const ConcentGraphComp = () => {
    const [graphData, setGraphData] = useState(initialData);
    const authContext = useContext(AuthContext);
    useEffect(() => {
        const getGraphData = async () => {
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/home/concent_graph"
            );
            if (status === 200) {
                setGraphData({
                    concent: data.map((v, i) => ({
                        x: v.date,
                        y: parseInt(v.concent_time),
                    })),
                    play: data.map((v, i) => ({
                        x: v.date,
                        y: parseInt(v.play_time),
                    })),
                });
            } else {
                alert("인터넷 연결이 불안정합니다.");
            }
        };
        getGraphData();
    }, []);
    return (
        <div className="Main-ContentGraphComp">
            <h4>집중 그래프</h4>
            <XYPlot
                height={150}
                width={500}
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
                    data={graphData.concent}
                />
                <VerticalBarSeries
                    color="#ffc9c9"
                    opacity={50}
                    barWidth={0.3}
                    data={graphData.play}
                />
            </XYPlot>
        </div>
    );
};

export default ConcentGraphComp;
