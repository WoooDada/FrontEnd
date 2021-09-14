import React, { useState, useEffect, useContext, useMemo } from "react";
import Chart from "react-apexcharts";

import getApi from "../api/getApi";
import { AuthContext } from "../App";

const initialData = [
    {
        name: "집중 시간(Hour)",
        data: [10, 0, 3, 2.3, 0, 5.1, 3.2],
    },
    {
        name: "딴짓 시간(Hour)",
        data: [1, 0, 0.2, 0.5, 1, 0.2, 1],
    },
];
const dowEn2Kr = () => {
    const dow_seq_list = ["월", "화", "수", "목", "금", "토", "일"];
    const right_ans = [];
    let i;
    const left_ans = [];
    const enDow_list = {
        Fri: "금",
        Sun: "일",
        Sat: "토",
        Mon: "월",
        Tue: "화",
        Wed: "수",
        Thu: "목",
    };
    const enDow = new Date().toDateString().split(" ")[0];
    const today = enDow_list[enDow];
    for (i = 0; i < dow_seq_list.length; i++) {
        right_ans.push(dow_seq_list[i]);
        if (dow_seq_list[i] === today) {
            break;
        }
    }
    i++;
    while (i < dow_seq_list.length) {
        left_ans.push(dow_seq_list[i]);
        i++;
    }
    return left_ans.concat(right_ans);
};
const NewGraphComp = () => {
    const [graphData, setGraphData] = useState(initialData);
    const [xCategories, setXCategories] = useState([
        "월",
        "화",
        "수",
        "목",
        "금",
        "토",
        "일",
    ]);
    const authContext = useContext(AuthContext);
    useEffect(() => {
        const getGraphData = async () => {
            const weekxs = dowEn2Kr();
            setXCategories(weekxs);
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                },
                "/home/concent_graph",
                authContext.state.token
            );
            // const data = {
            //     graph: [
            //         { date: "월", concent_time: 5, play_time: 5 },
            //         { date: "화", concent_time: 1, play_time: 0 },
            //         { date: "수", concent_time: 1, play_time: 2 },
            //         { date: "목", concent_time: 5, play_time: 5 },
            //         { date: "금", concent_time: 3, play_time: 2 },
            //         { date: "토", concent_time: 2, play_time: 2 },
            //         { date: "일", concent_time: 4, play_time: 2 },
            //     ],
            // };
            // const status = 200;
            if (status === 200) {
                await console.log(data.graph);
                // 무작위 월~일 데이터: 그 날 기준 6일 전까지로 정렬.
                await setGraphData([
                    {
                        name: "집중 시간(Hour)",
                        data: xCategories.map((x, i) => {
                            return data.graph.filter((v, _) => x === v.date)[0]
                                .concent_time;
                        }),
                    },
                    {
                        name: "딴짓 시간(Hour)",
                        data: xCategories.map((x, i) => {
                            return data.graph.filter((v, _) => x === v.date)[0]
                                .play_time;
                        }),
                    },
                ]);
            } else {
                await alert("인터넷 연결이 불안정합니다.");
            }
        };
        // getGraphData();
    }, [authContext.state.token, authContext.state.uid, xCategories]);
    // const series = graphData;

    const options = useMemo(
        () => ({
            colors: ["#9F8FFF", "#FAB39B"],
            chart: {
                type: "bar",
                stacked: true,
            },
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    dataLabels: {
                        position: "top", // top, center, bottom
                    },
                },
            },
            dataLabels: {
                enabled: false,
                formatter: function (val) {
                    return val + "Hour";
                },
                offsetY: 0,
                style: {
                    fontSize: "12px",
                    colors: ["#304758"],
                },
            },

            xaxis: {
                categories: xCategories,
                position: "top",
                axisBorder: {
                    show: false,
                    width: "10",
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    fill: {
                        type: "gradient",
                        gradient: {
                            colorFrom: "#D8E3F0",
                            colorTo: "#BED1E6",
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        },
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                    formatter: function (val) {
                        return val + "Hour";
                    },
                },
            },
        }),
        [xCategories]
    );
    return (
        <div className="Main-ConcentGraph-Wrapper">
            <p className="small-title">집중 그래프</p>

            <Chart
                options={options}
                series={graphData}
                type="bar"
                height={"100%"}
                // width={400}
                colors={["#5F45FF", "#E91E63"]}
            />
        </div>
    );
};

export default NewGraphComp;
