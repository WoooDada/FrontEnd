import React, { useEffect, useContext, useState, useRef } from "react";
import { AuthContext } from "../App";
import { BtnContext } from "../pages/Study";
import "../css/LeftStudy.css";
import { getApi } from "../api";
import { HeatMapGrid } from "react-grid-heatmap";
import { FaBlackberry, FaRegBell } from "react-icons/fa";
import useInterval from "@use-it/interval";
import { isCompositeComponentWithType } from "react-dom/test-utils";
import { ContinuousSizeLegend } from "react-vis";
import moment from "moment";

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

const isTenth = () => {
    const now = new Date();
    if (now.getMinutes() % 10 === 0) {
        return true;
    } else {
        return false;
    }
};

const TenMinPlanner = () => {
    const authContext = useContext(AuthContext);
    const btnContext = useContext(BtnContext);
    const concentTypeRef = useRef({ C: 0, P: 0 });
    const [tenMinData, setTenMinData] = useState([]);
    const [flag, setFlag] = useState(false);
    // const [tenMinData, setTenMinData] = useState([
    //     {
    //         stt_time: "07:40",
    //         end_time: "11:29",
    //         concent_type: "C", // c: concentrate & p: play
    //     },
    //     {
    //         stt_time: "14:00",
    //         end_time: "14:29",
    //         concent_type: "P",
    //     },
    // ]);

    useEffect(() => {
        // 첨에 접속했을때 update=F로, 한꺼번에 받아옴
        console.log("flag:", flag);
        if (btnContext.state.btnValue === false) {
            // if RightStudyComp 버튼이 stop일 경우
            if (flag === false) {
                setFlag(true);
                console.log("btnvalue:", btnContext.state.btnValue);

                const getTenmin = async () => {
                    const { status, data } = await getApi(
                        {
                            uid: authContext.state.uid,
                            update: btnContext.state.btnValue ? "T" : "F",
                            date: DateFormat(),
                        },
                        "/study/ten_min_data/"
                    );
                    // const { status, data } = { // Dummy Dummy
                    //     status: 200,
                    // };
                    await console.log("useeffect");
                    if (status === 200) {
                        await console.log("data.tenminlist", data.ten_min_list);
                        await setTenMinData(
                            data.ten_min_list.map((t) => ({
                                stt_time: t.stt_time,
                                end_time: t.end_time,
                                concent_type: t.concent_type,
                            }))
                        );
                        await console.log("tenMinData:", tenMinData);
                    } else {
                        alert("인터넷 연결이 불안정합니다.");
                    }
                };
                getTenmin();
                // plususeRefWhenStop();
                DrawGrid();
            }
        }
    });

    useInterval(() => {
        // if RightStudyComp의 버튼 start되면,
        if (btnContext.state.btnValue === true) {
            const getTenmin = async () => {
                const { status, data } = await getApi(
                    {
                        uid: authContext.state.uid,
                        update: btnContext.state.btnValue ? "T" : "F",
                        date: DateFormat(),
                    },
                    "/study/ten_min_data/"
                );
                // const { status, data } = { // Dummy Dummy
                //     status: 200,
                // };
                await console.log("useinterval!!!!!");
                if (status === 200) {
                    // await console.log(data.ten_min_list);
                    await setTenMinData(tenMinData.concat(data.ten_min_list));
                    // await console.log("tenMinData:", tenMinData);
                    await plususeRef(data.ten_min_list.concent_type); // useRef에 반영
                    // await plususeRef('C');
                } else {
                    alert("인터넷 연결이 불안정합니다.");
                }
            };
            getTenmin();
        }
    }, GET_RESULT_TIME * 1000);

    const plususeRef = (type) => {
        console.log("plususeRef");
        const tendata = {
            stt_time: "",
            end_time: "",
            concent_type: "",
        };
        concentTypeRef.current[type] += 1;
        if (isTenth()) {
            // 현재 시각 10n분이면,
            console.log("10분!");
            if (concentTypeRef.current["C"] + concentTypeRef.current["P"] > 4) {
                // 이거 개수 접근하는거 에러남
                tendata.stt_time = moment()
                    .subtract(10, "minutes")
                    .format("HH:mm");
                tendata.end_time = moment()
                    .subtract(1, "minutes")
                    .format("HH:mm");
                //tenMinData에 10분단위 데이터 넣고, useRef는 clear
                if (concentTypeRef.current["C"] > concentTypeRef.current["P"]) {
                    // C > P
                    tendata.concent_type = "C";
                } else {
                    // C < P
                    tendata.concent_type = "P";
                }
                setTenMinData(tenMinData.concat(tendata));
                // useRef 비워주기
                concentTypeRef.current["C"] = 0;
                concentTypeRef.current["P"] = 0;
            } else {
                // useRef에 쌓인 데이터가 4개 이하면 처리X
            }
        }
    };

    const plususeRefWhenStop = () => {
        // 아직 10n분 아닌데 stop 눌렀을 경우
        const howmany =
            concentTypeRef.current["C"] + concentTypeRef.current["P"];
        const tendata = {
            stt_time: "",
            end_time: "",
            concent_type: "",
        };
        if (howmany > 4) {
            tendata.stt_time = moment()
                .subtract(howmany, "minutes")
                .format("HH:mm");
            tendata.end_time = moment().subtract(1, "minutes").format("HH:mm");
            if (concentTypeRef.current["C"] > concentTypeRef.current["P"]) {
                // C > P
                tendata.concent_type = "C";
            } else {
                // C < P
                tendata.concent_type = "P";
            }
            setTenMinData(tenMinData.concat(tendata));
        } else {
            // useRef에 쌓인 데이터가 4개 이하면 처리X
        }
    };

    const timeToIndex = (stt_time, end_time) => {
        // return 값: stt_time의 인덱스 x,y, 칸수 len
        var r1 = 0;
        var r2 = 0;
        var len = 0;
        var diff = moment
            .utc(moment(end_time, "HH:mm").diff(moment(stt_time, "HH:mm")))
            .format("HH:mm"); // 00:00 형식의 차이
        var diff_split = diff.split(":");
        var time_diff = diff_split[0] * 1 * 60 + diff_split[1] * 1 + 1; // 분 차이: (hour*60 + min+1)/10
        var stt_split = stt_time.split(":"); //stsplit[0]=시간, stsplit[1]=분
        switch (stt_split[0]) {
            case "05":
                r1 = 0;
                break;
            case "06":
                r1 = 1;
                break;
            case "07":
                r1 = 2;
                break;
            case "08":
                r1 = 3;
                break;
            case "09":
                r1 = 4;
                break;
            case "10":
                r1 = 5;
                break;
            case "11":
                r1 = 6;
                break;
            case "12":
                r1 = 7;
                break;
            case "13":
                r1 = 8;
                break;
            case "14":
                r1 = 9;
                break;
            case "15":
                r1 = 10;
                break;
            case "16":
                r1 = 11;
                break;
            case "17":
                r1 = 12;
                break;
            case "18":
                r1 = 13;
                break;
            case "19":
                r1 = 14;
                break;
            case "20":
                r1 = 15;
                break;
            case "21":
                r1 = 16;
                break;
            case "22":
                r1 = 17;
                break;
            case "23":
                r1 = 18;
                break;
            case "00":
                r1 = 19;
                break;
            case "01":
                r1 = 20;
                break;
            case "02":
                r1 = 21;
                break;
            case "03":
                r1 = 22;
                break;
            case "04":
                r1 = 23;
                break;
        }
        switch (stt_split[1]) {
            case "00":
                r2 = 0;
                break;
            case "10":
                r2 = 1;
                break;
            case "20":
                r2 = 2;
                break;
            case "30":
                r2 = 3;
                break;
            case "40":
                r2 = 4;
                break;
            case "50":
                r2 = 5;
                break;
        }
        if (time_diff === 10) {
            // 한칸짜리면,
            return { x: r1, y: r2, len: 1 };
        } else {
            // 여러 칸 짜리면,
            len = time_diff / 10;
            return { x: r1, y: r2, len: len };
        }
    };

    const typetoInt = (type) => {
        if (type === "C") {
            return 100;
        } else if (type === "P") {
            return -100;
        }
    };

    const DrawGrid = () => {
        const xLabels = [0, 10, 20, 30, 40, 50];
        const yLabels = [
            5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
            23, 24, 1, 2, 3, 4,
        ];

        const data = new Array(yLabels.length)
            .fill(0)
            .map(() => new Array(xLabels.length).fill(0)); // 0 으로 초기화

        const DrawCell = (x, y, len, type) => {
            var l = 0;
            var i = 0;
            while (l < len) {
                data[x][y + i] = type;
                i += 1;
                l += 1;
                if (y + i > 5) {
                    x += 1;
                    i -= 6;
                }
            }
        };

        var value = 0;
        var returns;
        tenMinData.map(
            (t, i) => (
                (value = typetoInt(t.concent_type)),
                (returns = timeToIndex(t.stt_time, t.end_time)), // 시간 매개변수. 들어갈 칸 인덱스 배열로 반환
                // console.log(returns.x, returns.y, returns.len),
                DrawCell(returns.x, returns.y, returns.len, value)
            )
        );

        const cellColor = (ratio) => {
            if (ratio === 1) {
                return "#BCD6A7";
            } else if (ratio === 0) {
                return "#E9B2BC";
            } else {
                // ratio = 0.5
                return "rgb(225,229,234,0.5)";
            }
        };

        return (
            <HeatMapGrid
                yLabels={yLabels}
                yLabelsStyle={() => ({
                    fontSize: ".65rem",
                })}
                yLabelWidth={15}
                yLabelTextAlign="center"
                data={data}
                cellStyle={(_x, _y, ratio) => ({
                    background: cellColor(ratio),
                    // fontSize: "1px",
                    // color: FaBlackberry,
                })}
                // cellRender={(x, y, value) => (
                //     <div>{value}</div>
                // )}
                cellHeight="1.2rem"
                // onClick={(x, y) => alert(`Clicked (${x}, ${y})=${data[x][y]}`)}
            />
        );
    };

    return (
        <div className="daily-tenmin">
            <small>10 minute planner</small>
            <DrawGrid />
        </div>
    );
};

export default TenMinPlanner;
