import React, { useEffect, useContext, useState, useRef } from "react";
import { AuthContext } from "../App";
import { BtnContext } from "../pages/Study"
import "../css/LeftStudy.css";
import { getApi } from "../api";
import { HeatMapGrid } from 'react-grid-heatmap';
import { FaBlackberry } from "react-icons/fa";
import useInterval from "@use-it/interval";
import { isCompositeComponentWithType } from "react-dom/test-utils";
import { ContinuousSizeLegend } from "react-vis";
import moment from 'moment';

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
    if (now.getMinutes() % 10 === 0){
        return true;
    } else {
        return false;
    }
};

const nowTime = () => {
    const now = new Date();
    var result = '';
    return result.concat(now.getHours(),':', now.getMinutes());
};

const TenMinPlanner = () => {
    const authContext = useContext(AuthContext);
    const btnContext = useContext(BtnContext); 
    const concentTypeRef = useRef({ C: 0, P: 0 });
    // const [tenMinData, setTenMinData] = useState([]);
    const [tenMinData, setTenMinData] = useState([
        {
            stt_time: "9:00",
            end_time: "9:19",
            concent_type: "C", // c: concentrate & p: play
        },
        {
            stt_time: "11:00",
            end_time: "11:29",
            concent_type: "P",
        },
    ]);

    useEffect(() => { // 첨에 접속했을때 update=F로, 한꺼번에 받아옴
        if (btnContext.state.btnValue === false){ // if RightStudyComp 버튼이 stop일 경우
            console.log('btnvalue:', btnContext.state.btnValue);
            
            const getTenmin = async () => {
                // const { status, data } = await getApi(
                //     {
                //         uid: authContext.state.uid,
                //         update: btnContext.state.btnValue ? 'T' : 'F', 
                //         date: DateFormat(),
                //     },
                //     "/study/ten_min_data/"
                // );
                const { status, data } = { // Dummy Dummy
                    status: 200,
                };
                await console.log("useeffect");
                if (status === 200) {
                    // await console.log(data.ten_min_list);
                    // await setTenMinData(
                    //     data.ten_min_list.map(t => ({
                    //         stt_time: t.stt_time,
                    //         end_time: t.end_time,
                    //         concent_type: t.concent_type,
                    //     }))
                    // );
                    // await console.log("tenMinData:", tenMinData);
                } else {
                    alert("인터넷 연결이 불안정합니다.");
                }
            }
            getTenmin();
            plususeRefWhenStop();
        }
    });

    useInterval(() => {
        // if RightStudyComp의 버튼 start되면,
        if (btnContext.state.btnValue === true) {
            const getTenmin = async () => {
                // const { status, data } = await getApi(
                //     {
                //         uid: authContext.state.uid,
                //         update: btnContext.state.btnValue ? 'T' : 'F', 
                //         date: DateFormat(),
                //     },
                //     "/study/ten_min_data/"
                // );
                const { status, data } = { // Dummy Dummy
                    status: 200,
                };
                await console.log("useinterval!!!!!");
                if (status === 200) {
                    // await console.log(data.ten_min_list);
                    // await setTenMinData(tenMinData.concat(data.ten_min_list));
                    await console.log("tenMinData:", tenMinData);
                    // await plususeRef(data.ten_min_list.concent_type); // useRef에 반영
                    await plususeRef('C');
                } else {
                    alert("인터넷 연결이 불안정합니다.");
                }
            }
            getTenmin();
        }
    }, GET_RESULT_TIME * 1000);

    const plususeRef = (type) => {
        console.log('plususeRef');
        const tendata = {
            stt_time: '',
            end_time: '',
            concent_type: '',
        }
        concentTypeRef.current[type] += 1;
        if (isTenth()){ // 현재 시각 10n분이면,
            console.log('10분!');
            if (concentTypeRef.current['C'] + concentTypeRef.current['P'] > 4) { // 이거 개수 접근하는거 에러남
                tendata.stt_time = moment().subtract(10, 'minutes').format('HH:mm');
                tendata.end_time = moment().subtract(1, 'minutes').format('HH:mm');
                //tenMinData에 10분단위 데이터 넣고, useRef는 clear
                if (concentTypeRef.current['C'] > concentTypeRef.current['P']) { // C > P
                    tendata.concent_type = 'C';
                } else { // C < Ps
                    tendata.concent_type = 'P';
                }
                setTenMinData(tenMinData.concat(tendata));
                // useRef 비워주기
            } else {    
                // useRef에 쌓인 데이터가 4개 이하면 처리X
            }
        }
    };

    const plususeRefWhenStop = () => { // 아직 10n분 아닌데 stop 눌렀을 경우
        const howmany = concentTypeRef.current['C'] + concentTypeRef.current['P'];
        const tendata = {
            stt_time: '',
            end_time: '',
            concent_type: '',
        }
        if ( howmany > 4) {
            tendata.stt_time = moment().subtract(howmany, 'minutes').format('HH:mm');
            tendata.end_time = moment().subtract(1, 'minutes').format('HH:mm');
            if (concentTypeRef.current['C'] > concentTypeRef.current['P']) { // C > P
                tendata.concent_type = 'C';
            } else { // C < P
                tendata.concent_type = 'P';
            }
            setTenMinData(tenMinData.concat(tendata));
        } else {
            // useRef에 쌓인 데이터가 4개 이하면 처리X
        }
    };

    const tendataToHeatmap = (start, end) => {
        
    };

    const typetoInt = (type) => {
        if (type === 'C'){
            return 100;
        } else {
            return -100;
        }
    };
    
    const DrawGrid = () => {
        const xLabels = [0, 10, 20, 30, 40, 50];
        const yLabels = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            21, 22, 23, 24, 1, 2, 3, 4];

        var data = new Array(yLabels.length).fill(0).map(() =>
                new Array(xLabels.length).fill(0)); // 0 으로 초기화
            
        var value = 0;
        // 시,분 -> x,y축. data의 index
        // content_type : default(nothing) = 0 / C = 100 / P = -100
        // tenMinData.map((t, i) => (
        //     value = typetoInt(t.concent_type),
        //     timeToIndex(t.stt_time, t.end_time)  // 시간 매개변수. 들어갈 칸 인덱스 반환
        // ));

        return (
            <HeatMapGrid
                xLabels={xLabels}
                yLabels={yLabels}
                yLabelsStyle={() => ({
                    fontSize: ".65rem"
                })}
                yLabelWidth={15}
                yLabelTextAlign='center'
                data={data}
                cellStyle={(_x, _y, data) => ({
                    background: `rgb(120, 160, 44, ${data})`,
                    fontSize: "1px",
                    color: FaBlackberry,
                    
                })}
                // cellRender={(x, y, value) => (
                //     <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>
                // )}
                cellHeight="1.2rem"
                onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
            />
        );
    };

    return (
        <div className="daily-tenmin">
            <DrawGrid />
        </div>
    );
};

export default TenMinPlanner;