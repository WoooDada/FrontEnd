import React, { useEffect } from "react";

import CanvasJSReact from "../components/canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Graph = () => {
    let options = {
        animationEnabled: true,
        // title: {
        //     text: "Number of New Customers",
        // },
        axisY: {
            tickLength: 0,
            gridThickness: 0,
            lineThickness: 0,
            includeZero: false,
            labelFontSize: 0,
        },
        axisX: {
            tickLength: 0,
            gridThickness: 0,
            lineThickness: 0,
        },
        toolTip: {
            shared: true,
        },
        data: [
            {
                type: "spline",
                name: "2016",
                showInLegend: false,

                dataPoints: [
                    { y: 1000, label: "Jan" },
                    { y: 1000, label: "Feb" },
                    { y: 1000, label: "Mar" },
                    { y: 1000, label: "Apr" },
                    { y: 1000, label: "May" },
                    { y: 1000, label: "Jun" },
                    { y: 1000, label: "Jul" },
                    { y: 1000, label: "Aug" },
                    { y: 1000, label: "Sept" },
                    { y: 1000, label: "Oct" },
                    { y: 1000, label: "Nov" },
                    { y: 1000, label: "Dec" },
                ],
            },
            {
                type: "spline",
                name: "2017",
                showInLegend: false,
                dataPoints: [
                    { y: 1720, label: "Jan" },
                    { y: 1720, label: "Feb" },
                    { y: 1720, label: "Mar" },
                    { y: 1720, label: "Apr" },
                    { y: 1720, label: "May" },
                    { y: 1720, label: "Jun" },
                    { y: 1720, label: "Jul" },
                    { y: 1720, label: "Aug" },
                    { y: 1720, label: "Sept" },
                    { y: 1720, label: "Oct" },
                    { y: 1720, label: "Nov" },
                    { y: 1720, label: "Dec" },
                ],
            },
        ],
    };
    useEffect(() => {}, []);

    return (
        <div>
            <CanvasJSChart
                options={options}
                /* onRef={ref => this.chart = ref} */
            />
        </div>
    );
};

export default Graph;
