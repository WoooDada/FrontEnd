import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../App";
import "../css/LeftStudy.css";
import { getApi } from "../api";
import { HeatMapGrid } from "react-grid-heatmap";
import { FaBlackberry } from "react-icons/fa";
import useInterval from "@use-it/interval";

const GET_RESULT_TIME = 60; // 1분=60초마다

const DateFormat = () => {
    const today = new Date();
    var todayMonth = "";
    if ((today.getMonth() + 1).toString().length == 1) {
        todayMonth = "0" + (today.getMonth() + 1).toString();
    } else {
        todayMonth = today.getMonth() + 1;
    }

    const result = "".concat(
        today.getFullYear(),
        "-",
        todayMonth,
        "-",
        today.getDate()
    );
    return result;
};

const TenMinPlanner = () => {
    const authContext = useContext(AuthContext);
    const [update, setUpdate] = useState(false);

    // const [tenMinData, setTenMinData] = useState([]);
    const [tenMinData, setTenMinData] = useState([
        {
            stt_time: "9:00",
            end_time: "9:10",
            concent_type: "C", // c: concentrate & p: play
        },
        {
            stt_time: "11:00",
            end_time: "11:20",
            concent_type: "P",
        },
    ]);

    useInterval(() => {
        console.log("useinterval");
        const getTenmin = async () => {
            await console.log("update:", update);
            const { status, data } = await getApi(
                {
                    uid: authContext.state.uid,
                    update: update ? "T" : "F", // 첨에 접속했을때 update=F로, 한꺼번에 받아옴
                    date: DateFormat(),
                },
                "/study/ten_min_data/"
            );
            // const { status, data } = { // Dummy Dummy
            //     status: 200,
            // };
            // await console.log(data);
            if (status === 200) {
                await console.log(data.ten_min_list);
                if (update === false) {
                    // update=F 한꺼번에 받아옴
                    await setTenMinData(
                        data.ten_min_list.map((t) => ({
                            stt_time: t.stt_time,
                            end_time: t.end_time,
                            concent_type: t.concent_type,
                        }))
                    );
                    setUpdate(true);
                    console.log("if 111");
                } else {
                    // update=T 데이터 하나 추가
                    console.log("if2222");
                    await setTenMinData(tenMinData.concat(data.ten_min_list));
                }
                await console.log("tenMinData:", tenMinData);
            } else {
                alert("인터넷 연결이 불안정합니다.");
            }
        };
        getTenmin();
    }, GET_RESULT_TIME * 1000);

    const DrawGrid = () => {
        const xLabels = [0, 10, 20, 30, 40, 50];
        const yLabels = [
            5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
            23, 24, 1, 2, 3, 4,
        ];

        const data = new Array(yLabels.length) // 0 으로 초기화
            .fill(0)
            .map(
                () =>
                    new Array(xLabels.length)
                        .fill(0)
                        .map(() => Math.floor((0.5 - Math.random()) * 200)) // 랜덤으로 -100 ~ 100 숫자
            );

        // 시,분 -> x,y축. data의 index
        // content_type : default(nothing) = 0 / C = 100 / P = -100
        // tenMinData를 heatmap 형식에 맞는 데이터로.
        // tenMinData.map(
        //     (t, i) => (console.log(t.stt_time), console.log(t.end_time))
        // );

        return (
            <HeatMapGrid
                xLabels={xLabels}
                yLabels={yLabels}
                xLabelsLocation={"top"}
                xLabelsStyle={() => ({
                    fontSize: ".65rem",
                })}
                yLabelsStyle={() => ({
                    fontSize: ".65rem",
                })}
                xLabelWidth={10}
                yLabelWidth={15}
                yLabelTextAlign="center"
                data={data}
                cellStyle={(_x, _y, data) => ({
                    background: `rgb(120, 160, 44, ${data})`,
                    fontSize: ".7rem",
                    color: FaBlackberry,
                    color: `rgb(0, 0, 0)`,
                })}
                cellRender={(x, y, value) => (
                    <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>
                )}
                cellHeight="1.2rem"
                onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
            />
        );
    };

    // const DrawTenMin = ({ stt_time, end_time, concent_type }) => {

    // };

    return (
        <div className="daily-tenmin">
            <DrawGrid />
            {/* {tenMinData.map((d, i) => (
                <DrawTenMin
                    key={d.id}
                    stt_time={d.stt_time}
                    end_time={d.end_time}
                    concent_type={d.concent_type}
                ></DrawTenMin>
            ))} */}
        </div>
    );
};

export default TenMinPlanner;